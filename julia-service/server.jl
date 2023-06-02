using WebSockets
import WebSockets: Response, Request, target
using Dates
using Sockets
using InverseLaplace
using HTTP
using JSON

include("infolabs.jl")

global LASTSERVER = 0

const HTTPPORT = 2812
#const LOCALIP = string(Sockets.getipaddr())
const LOCALIP = "0.0.0.0"
const USERNAMES = Dict{String,WebSocket}()

# @info """
# A chat server application. For each browser (tab) that connects,
# an 'asyncronous function' aka 'coroutine' aka 'task' is started.

# To use:
#     - include("chat_explore.jl") in REPL
#     - start a browser on the local ip address, e.g.: http://192.168.0.4:8080
#     - inspect global variables starting with 'LAST' while the chat is running asyncronously 

# """

# Since we are to access a websocket from outside
# it's own websocket handler coroutine, we need some kind of
# mutable container for storing references:
const WEBSOCKETS = Dict{WebSocket,Int}()
global ListInfoLabs = Dict{WebSocket,InfoLab}()

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
        if infolab.name == "logs"
            writeguarded(ws, log)
        end
    end
end

function removereferences(ws)
    haskey(WEBSOCKETS, ws) && pop!(WEBSOCKETS, ws)
    for (discardname, wsref) in USERNAMES
        if wsref === ws
            pop!(USERNAMES, discardname)
            break
        end
    end
    nothing
end


function approvedusername(msg, ws)
    !startswith(msg, "userName:") && return ""
    newname = msg[length("userName:")+1:end]
    newname == "" && return ""
    haskey(USERNAMES, newname) && return ""
    push!(USERNAMES, newname => ws)
    newname
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
    # println(req)
    # println("----------------------------")
    # println(req.method)
    # println(target(req))
    # println(req.target)
    # if target(req) == "/favicon.ico"
    #     return read(joinpath(@__DIR__, "www/favicon.ico"))
    # end
    #return read(joinpath(@__DIR__, "chat_explore.html"), String)

    req.target == "/" && return HTTP.Response(200, read("www/index.html"))
    #file = HTTP.unescapeuri(req.target[2:end]))
    file = "www/" * req.target[2:end]
    # println(file)
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