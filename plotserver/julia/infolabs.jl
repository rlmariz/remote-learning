#pkg> add InverseLaplace

#module InfoLabs

export process_message

using InverseLaplace
#import InverseLaplace: talbot

export InfoLab

mutable struct InfoLab
    tp::String
    name::String
    func::String
    func_parse::Function
    func_invlap::Talbot

    Values::Any
    Socket::Any

    CalcInverseLaplace::Any
    CalcValue::Any
    ReadMessage::Any

    function InfoLab()
        this = new()

        this.Values = []

        this.CalcInverseLaplace = function ()
            f = eval(Meta.parse("f(s) = " * this.func))
            this.func_invlap = Talbot(f, 80)
            nothing
        end

        this.CalcValue = function (time::Int)
            local value = eval(
                Meta.parse(
                    "InverseLaplace.talbot(s -> (" *
                    this.func *
                    ")*1/s" *
                    ", " *
                    string(time) *
                    ")",
                ),
            )
            #local value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * "8 / (8s + 1)" * ")*1/s" * ", " * "1" * ")"))
            #push!(this.Values, (time, this.func_invlap(time))) 
            #push!(this.Values, (time, value))
            if isnan(value)
                value = 0
            end
            return value
        end

        this.ReadMessage = function (message::String)
            process_message(this, message)
        end

        return this
    end
end

function process_message(infolab::InfoLab, message::String)

    value = 0;
    time = 0;
    msg = "";

    if startswith(message, "tfs:")
        try
            msg = "tfs";
            infolab.func = message[length("tfs:")+1:end]
        catch e
            println(e)
        end
    end

    if startswith(message, "tfn:")
        try
            msg = "tfn";
            infolab.name = message[length("tfn:")+1:end]
            @info "tfn: " name = infolab.name
        catch e
            println(e)
        end
    end

    if startswith(message, "tfc:")
        try
            msg = "tfc";
            time = parse(Int, message[length("tfc:")+1:end])
            value = infolab.CalcValue(time)            
            # msg = "$value";
            # send(client, "$value")
            # notifyplot(infolab.name, time, value)
            #local value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * infolab.func * ")*1/s" * ", " * "1" * ")"))
                # value
            @info "Calc: " time = time value = value
        catch e
            println(e)
        end
    end

    return time, value, msg;
end
