console.clear();

var _ = require('underscore');

function Tanque_rk(x0, u, h){
    //1a chamada
    var xd = Tanque_xdot(x0,u);
    var savex0 = x0;
    var phi = xd;
    var x0 = savex0 + 0.5 * h * xd;    

    //2a chamada
    xd = Tanque_xdot(x0,u);
    phi = phi + 2 * xd;
    x0 = savex0 + 0.5 * h * xd;    

    //3a chamada
    xd = Tanque_xdot(x0,u);
    phi = phi + 2 * xd;
    x0 = savex0 + h * xd;

    //4a chamada
    xd = Tanque_xdot(x0,u);
    var x = savex0+(phi+xd)*h/6;

    return x;
}

function Tanque_xdot(x, u) {
    //valores hipoteticos dos parametros
    var C = 1; // area constante do tanque
    var K = 0.5; // constante do registro

    //Differential equations
    var qs = K * Math.sqrt(x);
    var xd = (u - qs) / C;

    //para evitar erros numéricos (o nivel nao pode ser negativo!)
    if (Math.abs(x) < 0.01){
        xd = 0.01;
    }

    return xd;
}

function SimulaTanque() {

    //tempo inicial e final
    var t0 = 0;
    var tf = 120;

    //intervalo de integracao
    var h = 0.2;
    var t = _.range(t0, tf, h); //vetor de tempo para a simulacao

    //parametros usados no modelo
    var C = 1; //area constante do tanque
    var K = 0.5; // constante do registro


    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //% simulacao da equacao diferencial

    //% condicao inicial (nivel no inicio da simulacao)
    var x0 = 2;
    var x = Array.from({length: t.length}, (_) => 0);
    x[0] = x0;

    //% a entrada é dividida em 3 periodos. No primeiro ela eh nula (o tanque
    //% esvazia). No segundo a vazao de entrada passa a ser 1. No terceiro
    //% periodo passa a ser 1,05.
    var qe0   = Array.from({length: 100}, (_) => 0);
    var qe1   = Array.from({length: 300}, (_) => 1);
    var qe1p1 = Array.from({length: 201}, (_) => 1.05);

    //juntam-se os 3 periodos em um unico vetor de entrada.
    var qe = [];
    qe.push.apply(qe, qe0);
    qe.push.apply(qe, qe1);
    qe.push.apply(qe, qe1p1);

    for(let i = 1; i < t.length-1; i++){
        //chama a rotina de integracao numerica para a resolucao (numerica) da
        //equacao diferencial (balanco de massa)
        x[i] = Tanque_rk(x[i-1], qe[i], h);
        console.log(i, x[i]);
    }

    // for(let i = 1; i <= 1; i++){
    //     console.log(x[i-1])
    //     console.log(qe[i])
    //     console.log(h)
    //     console.log(t[i])
    //     a = rkTanque(x[i-1], qe[i], h, t[i]);
    //     console.log(x[i])
    //     //x[i] = rkTanque(x[i-1], qe[i], h, t[i]);
    //     //console.log(x[i])
    // };


    //x = dvTanque(1, 2, 3)
    //console.log(x[599]);
}

SimulaTanque()