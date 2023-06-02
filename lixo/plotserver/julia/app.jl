#using Pkg
#Pkg.add("SimpleWebsockets")

using SimpleWebsockets

using InverseLaplace

include("infolabs.jl")
using .InfoLabs

#global f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
global ListInfoLabs = Dict{String, InfoLab}()
# global  func_invlap = 0;
# func_invlap = InverseLaplace.Talbot(f, 5); 

server = WebsocketServer()
ended = Condition() 


listen(server, :listening) do details::NamedTuple
    #@info details.port::Int
    #@info details.host::Union{Sockets.IPv4, Sockets.IPv6}
    #@info details.host::Sockets.IPv4
    @info details
    @info "Server Started"
end

listen(server, :client) do client
    @info "Client Connected: " client = client.id

    #il = InfoLab();

    if !haskey(ListInfoLabs, client.id )
        a = InfoLab();
        a.Socket = client
        push!(ListInfoLabs, client.id => a)
    end

    listen(client, :message) do message        

        let infolab = get(ListInfoLabs, client.id, InfoLab())

            if startswith(message, "tfs:")
                try            
                    infolab.func = message[length("tfs:") + 1:end]
                catch e
                    println(e)
                end
            end

            if startswith(message, "tfn:")
                try            
                    infolab.name = message[length("tfn:") + 1:end]
                    @info "tfn: " client = client.id name = infolab.name
                catch e
                    println(e)
                end
            end

            if startswith(message, "tfc:")
                try      
                    local time = parse(Int, message[length("tfc:") + 1:end]);
                    local value = infolab.CalcValue(time)                    
                    send(client, "$value")
                    notifyplot(infolab.name, time, value)
                    #local value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * infolab.func * ")*1/s" * ", " * "1" * ")"))
                    @info "Calc: " client = client.id message = message time = time value = value
                    #let time = message[length("tfc:") + 1:end]
                    #    local value = infolab.CalcValue(time)                    
                    #    @info "Calc: " time = time value = value
                    #end
                catch e
                    println(e)
                end
            end

            # is = InfoLab();

            # is.name = "teste";
            # is.tp = "tf";
            # is.func = "(8 / (8s + 1))*1/s";

            # is.CalcInverseLaplace();

            # try 
            #     println("1111111111----------------")
            #     #eval(Meta.parse("infolab.func_parse = (8 / (8s + 1))*1/s"));
            #     value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * infolab.func * ")*1/s" * ", " * "1" * ")"))
            #     println(value)
                
            #     #f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
            #     #func_invlap = Talbot(f, 80); 
            #     value_calc = parse(Int, message[length("tfc:") + 1:end]);
            #     func_invlap = Talbot(eval(Meta.parse("func_invlap(s) = (8 / (8s + 1))*1/s")), 80); 
            #     let value = func_invlap(value_calc);
            #         @info "Message: " client = client.id message = message value = value
            #     end
            #     #@info "Message: " client = client.id message = message value = value

            #     println("2222222222")
            # catch e
            #     println(e)
            # end

            #@info "Message: " client = client.id message = message
        end

        #send(client, "Echo back at you: $message")
    end
end

function notifyplot(name, time, value)
    #for pair in ListInfoLabs
        #@info "Notify Plot: " client = pair.id
        for (key, client) in ListInfoLabs
            message = "{\"name\": \"$name\", \"time\": $time, \"value\": $value}";
            send(client.Socket, message)
        end
        # @info "Notify Plot: "
    #end            
end

function distributemsg(msgout, not_to_ws)
    foreach(keys(WEBSOCKETS)) do ws
        if ws !== not_to_ws
            writeguarded(ws, msgout)
        end
    end
    nothing
end

listen(server, :connectError) do err
    notify(ended, err, error = true)
end

listen(server, :closed) do details
    @warn "Server has closed" details...
    notify(ended)
end

#@async serve(server; verbose = true, host = "0.0.0.0", port = 2812)
@async serve(server, 2812, "0.0.0.0"; verbose = true )
#@async serve(server; verbose = true)

wait(ended)