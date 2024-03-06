export process_message
export InfoLab

using InverseLaplace

mutable struct InfoLab
    name::String

    Socket::Any

    CalcValue::Any
    ReadMessage::Any

    function InfoLab()
        this = new()

        this.name = ""

        this.CalcValue = function (tf::String, input::String, time::Float32)
            local value = eval(
                Meta.parse(
                    "InverseLaplace.talbot(s -> ( $tf ) * $input , $time)",
                ),
            )

            if isnan(value)
                value = 0
            end

            value2 = float(value)

            local num_digits = 4;
            value2 = round(value2, digits=num_digits)

            return convert(Float32, value2)
        end

        this.ReadMessage = function (message::String)
            process_message(this, message)
        end

        return this
    end
end

function process_message(infolab::InfoLab, message::String)

    value ::  Float32 = 0;
    time :: Float32 = 0;
    ret :: String = "";

    if startswith(message, "{") && endswith(message, "}")
        eventJson = JSON.parse(message)
        event = eventJson["event"]

        if event == "tfc"
            input = eventJson["input"]
            time = eventJson["time"]
            tf =  eventJson["tf"]

            try
                value = infolab.CalcValue(tf, input, time)         
                ret = JSON.json(Dict("time" => time, "value" => value))   
                @info "tfc: time = $time value = $value"  
            catch e
                println(e)
            end
        end

        if event == "snm"
            name = eventJson["name"]
            infolab.name = name
            @info "snm: name = $name" 
        end        
    end

    return ret;
end
