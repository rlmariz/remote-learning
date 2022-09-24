"Request to response. Response is the predefined HTML page with some javascript"
req2resp(req::Request) = HTMLSTRING |> Response

"""
Called by 'gatekeeper', this function will be running in a task while the
particular websocket is open. The argument is an open websocket.
Other instances of the function run in other tasks.
"""
function coroutine(thisws)
    #push!(SocketList, thisws => length(WEBSOCKETS) +1 )
    #infolab = InfoLab();
    username = ""
    while true
        # This next call waits for a message to
        # appear on the socket. If there is none,
        # this task yields to other tasks.
        data, success = readguarded(thisws)
        !success && break
        #global LASTMSG = msg = String(data)
        msg = String(data)
        println("Received: $msg ")

        if startswith(msg, "tf:")
            # tf = msg[length("tf:") + 1:end];

            # infolab.func = tf;

            # infolab.CalcInverseLaplace();
            # println(infolab)
            # println("tf: $tf ")
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

        if startswith(msg, "tfc:")
            v = msg[length("tfc:") + 1:end];
            v2 = parse(Int, v);            

            try
                infolab.CalcValue(1);
            catch e
                println(e)
                println("Cannot calculate value")
            end

            println(infolab.Values);
        end

        # if username == ""
        #     username = approvedusername(msg, thisws)
        #     if username != ""
        #         println("from new user $username ")
        #         !writeguarded(thisws, username) && break
        #         println("Tell everybody about $username")
        #         foreach(keys(WEBSOCKETS)) do ws
        #             writeguarded(ws, username * " enters chat")
        #         end
        #     else
        #         println(", username taken!")
        #         !writeguarded(thisws, "Username taken!") && break
        #     end
        # else
        #     println("from $username ")
        #     distributemsg(username * ": " * msg, thisws)
        #     startswith(msg, "exit") && break
        # end
    end
    exitmsg = username == "" ? "unknown" : username * " has left"
    distributemsg(exitmsg, thisws)
    println(exitmsg)
    # No need to close the websocket. Just clean up external references:
    removereferences(thisws)
    nothing
end

"""
`Server => gatekeeper(Request, WebSocket) => coroutine(WebSocket)`

The gatekeeper makes it a little harder to connect with
malicious code. It inspects the request that was upgraded
to a a websocket.
"""
function gatekeeper(req, ws)
    global LASTREQ = req
    global LASTWS = ws
    #orig = WebSockets.origin(req)
    # if occursin(LOCALIP, orig)
        coroutine(ws)
    # else
    #     @warn("Unauthorized websocket connection, $orig not approved by gatekeeper, expected $LOCALIP")
    # end
    nothing
end