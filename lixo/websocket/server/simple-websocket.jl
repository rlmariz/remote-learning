# import WebSockets:Response, Request
using WebSockets
using InverseLaplace


# function coroutine_test(req, ws)
#     println("before calc")
#     try            
#         f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
#         #func_invlap = Talbot(f, 80); 
#         func_invlap = InverseLaplace.Talbot(f, 5); 
#         println(func_invlap);
#         println("before calc")
#         println(func_invlap(1));
#     catch e
#         println(e)
#     end
#     println("after calc")
# end

# req2resp(req::Request) = "" |> Response
# global SocketServer = WebSockets.ServerWS(req2resp, coroutine_test)

function readguarded2(ws)


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

    data = Vector{UInt8}()
    success = true
    try
        data = read(ws)                
    catch err
        @debug err
        data = Vector{UInt8}()
        success = false
    finally
        return data, success
    end
end

serverWS = WebSockets.ServerWS((req) -> WebSockets.Response(200), (ws_server) -> (writeguarded(ws_server, "Hello"); readguarded2(ws_server)))
ta = @async WebSockets.with_logger(WebSocketLogger()) do
    WebSockets.serve(serverWS, "0.0.0.0", 2812)
end

# @async WebSockets.serve(SocketServer, "0.0.0.0", 2812)

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

quit()

# begin

#     println("before calc")
#     try            
#         f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
#         #func_invlap = Talbot(f, 80); 
#         func_invlap = InverseLaplace.Talbot(f, 5); 
#         println(func_invlap);
#         println("before calc")
#         println(func_invlap(1));
#     catch e
#         println(e)
#     end
#     println("after calc")

#     quit();
# end

nothing
