using WebSockets
import WebSockets:Response,
                  Request
using Dates
using Sockets

using InverseLaplace
#import InverseLaplace: talbot

# include("infolabs.jl")
# using .InfoLabs

global LASTREQ = 0
global LASTWS = 0
global LASTMSG = 0
global LASTSERVER = 0

const CLOSEAFTER = Dates.Second(15)
const HTTPPORT = 2812
const LOCALIP = string(Sockets.getipaddr())
#const USERNAMES = Dict{String, WebSocket}()
global USERNAMES = Dict{String, WebSocket}()
const HTMLSTRING = read(joinpath(@__DIR__, "chat_explore.html"), String)

include("server-utils.jl")

ended = Condition();

function calc()
    println("before calc")
    try            
        f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
        #func_invlap = Talbot(f, 80); 
        func_invlap = InverseLaplace.Talbot(f, 5); 
        println(func_invlap);
        println("before calc")
        println(func_invlap(1));
    catch e
        println(e)
    end
    println("after calc")
end

function coroutine_test(req, ws)
    calc()
    println("before calc")
    try            
        f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
        #func_invlap = Talbot(f, 80); 
        func_invlap = InverseLaplace.Talbot(f, 5); 
        println(func_invlap);
        println("before calc")
        println(func_invlap(1));
    catch e
        println(e)
    end
    println("after calc")
end

global LASTSERVER = WebSockets.ServerWS(req2resp, coroutine_test)

@info """
A chat server application. For each browser (tab) that connects,
an 'asyncronous function' aka 'coroutine' aka 'task' is started.

To use:
    - include("chat_explore.jl") in REPL
    - start a browser on the local ip address, e.g.: http://192.168.0.4:2812
    - inspect global variables starting with 'LAST' while the chat is running asyncronously 

"""

# Since we are to access a websocket from outside
# it's own websocket handler coroutine, we need some kind of
# mutable container for storing references:
const WEBSOCKETS = Dict{WebSocket, Int}()
const SocketList = Dict{WebSocket, String}()

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
    newname = msg[length("userName:") + 1:end]
    newname =="" && return ""
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


# The following lines disblle detail messages from spilling into the
# REPL. Remove the it to gain insight.
using Logging
import Logging.shouldlog
function shouldlog(::ConsoleLogger, level, _module, group, id)
    return true
    if _module == WebSockets.HTTP.Servers
        if level == Logging.Warn || level == Logging.Info
            return false
        else
            return true
        end
    else
        return true
    end
end

# ServerWS takes two functions; the first a http request handler function for page requests,
# one for opening websockets (which javascript in the HTML page will try to do)
#global LASTSERVER = WebSockets.ServerWS(req2resp, gatekeeper)

# Start the server asyncronously, and stop it later
@async WebSockets.serve(LASTSERVER, LOCALIP, HTTPPORT)

function getc1()
    ret = ccall(:jl_tty_set_mode, Int32, (Ptr{Cvoid},Int32), stdin.handle, true)
    ret == 0 || error("unable to switch to raw mode")
    c = read(stdin, Char)
    ccall(:jl_tty_set_mode, Int32, (Ptr{Cvoid},Int32), stdin.handle, false)
    c
end

function quit()
    print("Press q to quit!");
    while true
        opt = getc1();
        if opt == 'q'
            break
        else
            continue
        end
    end
end

println("****Start****")
#@async begin
begin

    println("before calc")
    try            
        f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
        #func_invlap = Talbot(f, 80); 
        func_invlap = InverseLaplace.Talbot(f, 5); 
        println(func_invlap);
        println("before calc")
        println(func_invlap(1));
    catch e
        println(e)
    end
    println("after calc")


    println("HTTP server listening on $LOCALIP:$HTTPPORT for $CLOSEAFTER")
    #sleep(CLOSEAFTER.value)
    quit();
    println("Time out, closing down $HTTPPORT")
    put!(LASTSERVER.in, "I can send anything, you close")
    nothing
    println("teste 4")
end

#quit();

# wait_for_key("press any key to continue")
# put!(LASTSERVER.in, "I can send anything, you close")

#notify(ended)
#wait(ended)

# for inspecting in REPL or Atom / Juno - update after starting some clients.
println("teste 1")
LASTWS
LASTSERVER.out
WEBSOCKETS
println("teste 2")
#take!(LASTSERVER.out)|>string
nothing
println("teste 3")