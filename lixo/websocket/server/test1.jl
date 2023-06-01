include("infolabs.jl")

using .InfoLabs

println("*** Inicio ***")

# f2(s) = s / (s^2 + 1);
# ft2 = Talbot(f2, 80);
# ft2(pi / 2) #corret

# f1 = eval(Meta.parse("f1(s) = s / (s^2 + 1)")) 
# ft1 = Talbot(f1, 80);
# ft1(pi / 2) 

# Talbot(eval(Meta.parse("f1(s) = s / (s^2 + 1)")) , 80);


is = InfoLab();

is.name = "teste";
is.tp = "tf";
is.func = "(8 / (8s + 1))*1/s";

is.CalcInverseLaplace();

for i = 0:50
    is.CalcValue(i);
end

println(is.Values);

println("*** Fim ***")