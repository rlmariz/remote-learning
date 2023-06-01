using InverseLaplace
import InverseLaplace: talbot

try  
    #f = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
    f(s) = eval(Meta.parse("f(s) = (8 / (8s + 1))*1/s"));
    func_invlap = Talbot(f, 2);
    println(func_invlap);
    println(func_invlap(1));
catch e
    println(e)
end    

nothing

f3 = Talbot(s -> eval(Meta.parse("(8 / (8s + 1))*1/s")), 32);

f1 = Meta.parse("(8 / (8s + 1))*1/s")
f2 = Talbot(f1, 2);
f2 = eval(f1)

f4 = InverseLaplace.talbot(s -> (8 / (8s + 1))*1/s, 1)

eval(Meta.parse("InverseLaplace.talbot(s -> (8 / (8s + 1))*1/s, 1)"))

eval(Meta.parse("InverseLaplace.talbot(s -> (" * "8 / (8s + 1)" * ")*1/s" * ", " * "1" * ")"))

f(s) = eval(
    Meta.parse("(8 / (8s + 1))*1/s")
    ;