using WebSockets
import WebSockets: Response, Request, target
using Dates
using Sockets
using InverseLaplace
using HTTP
using JSON

include("infolabs.jl")

global LASTSERVER = 0
global ListInfoLabs = Dict{WebSocket,InfoLab}()

const HTTPPORT = 2812
const LOCALIP = "0.0.0.0"
const WEBSOCKETS = Dict{WebSocket,Int}()

ended = Condition()

"""
Called by 'gatekeeper', this function will be running in a task while the
particular websocket is open. The argument is an open websocket.
Other instances of the function run in other tasks.
"""
function coroutine(thisws)
    @info "Coroutine Started $thisws"
    push!(WEBSOCKETS, thisws => length(WEBSOCKETS) + 1)
    push!(ListInfoLabs, thisws => InfoLab())
    while true

        data, success = readguarded(thisws)
        
        !success && break

        msg = String(data)

        if msg == ""
            continue
        end

        startswith(msg, "exit") && break

        try
            let infolab = get(ListInfoLabs, thisws, InfoLab())                
                local ret = process_message(infolab, msg)
                if ret != ""
                    writeguarded(thisws, ret)
                    distributlog(ret)
                end
            end
        catch err
            println("error [$err] on process message [$msg].")
        end
    end
    @info "Coroutine Ended $thisws"
    # No need to close the websocket. Just clean up external references:
    removereferences(thisws)
    nothing
end

function distributlog(log)
    for (ws, infolab) in ListInfoLabs
        if !isnothing(infolab.name) && infolab.name == "logs"
            writeguarded(ws, log)
        end
    end
end

function removereferences(ws)
    haskey(WEBSOCKETS, ws) && pop!(WEBSOCKETS, ws)    
    nothing
end

function distributemsg(msgout, not_to_ws)
    foreach(keys(WEBSOCKETS)) do ws
        if ws !== not_to_ws
            writeguarded(ws, msgout)
        end
    end
    nothing
end


"""
`Server => gatekeeper(Request, WebSocket) => coroutine(WebSocket)`

The gatekeeper makes it a little harder to connect with
malicious code. It inspects the request that was upgraded
to a a websocket.
"""
function gatekeeper(req, ws)
    orig = WebSockets.origin(req)

    @info "Websocket connection ip = $orig"  

    coroutine(ws)

    nothing
end

"Request to response. Response is the predefined HTML page with some javascript"
function req2resp(req::Request)
    req.target == "/" && return HTTP.Response(200, read("www/index.html"))
    file = "www/" * req.target[2:end]
    return isfile(file) ? HTTP.Response(200, read(file)) : HTTP.Response(404)
end

# ServerWS takes two functions; the first a http request handler function for page requests,
# one for opening websockets (which javascript in the HTML page will try to do)
global LASTSERVER = WebSockets.ServerWS(req2resp, gatekeeper)

# Start the server asyncronously, and stop it later
@async WebSockets.serve(LASTSERVER, LOCALIP, HTTPPORT)

wait(ended)

println("* ** ***Julia Service Ended*** ** *")

nothing