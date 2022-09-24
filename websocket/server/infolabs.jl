#pkg> add InverseLaplace

module InfoLabs

using InverseLaplace
#import InverseLaplace: talbot

export InfoLab;

mutable struct InfoLab
    tp::String
    name::String
    func::String
    func_parse::Function
    func_invlap::Talbot

    Values;

    CalcInverseLaplace;
    CalcValue;

    function InfoLab() 
        this = new()

        this.Values = [];

        this.CalcInverseLaplace = function()
            f = eval(Meta.parse("f(s) = " * this.func));
            this.func_invlap = Talbot(f, 80);        
            nothing
        end

        this.CalcValue = function(time::Int)
            local value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * this.func * ")*1/s" * ", " * string(time) * ")"))
            #local value = eval(Meta.parse("InverseLaplace.talbot(s -> (" * "8 / (8s + 1)" * ")*1/s" * ", " * "1" * ")"))
            #push!(this.Values, (time, this.func_invlap(time))) 
            #push!(this.Values, (time, value))
            return value
        end        

        return this
     end
end

end