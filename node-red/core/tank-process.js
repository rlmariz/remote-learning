module.exports = class TankProcess {

    constructor(area, maxLevel,  valveK, valveOpen, integrationInterval, intervalUpdate, inputFlow, level) {
        //params
        this.area = area || 0;
        this.maxLevel = maxLevel || 0;
        this.valveK = valveK || 0;
        this.valveOpen = valveOpen || 0;
        this.integrationInterval = integrationInterval || 0;
        this.intervalUpdate = intervalUpdate || 0;

        //process
        this.level = level || 0;
        this.inputFlow = inputFlow || 0;
        this.outputFlow = 0;
     }

    //  set inputFlow(inputFlow_){
    //     this.inputFlow = inputFlow_;
    //  }

     step(integrationInterval){
        this.level = this.tank_RK(this.level, this.inputFlow,  integrationInterval || this.integrationInterval) || 0;
        this.level = Math.round(this.level * 1000) / 1000;

        return this.level;
     }

    tank_Xdot(x, u) {
        //Differential equations
        this.outputFlow = this.valveK * (this.valveOpen / 100) * Math.sqrt(x);
        var xd = (u - this.outputFlow) / this.area;

        //to avoid numerical errors (the level cannot be negative!)
        if (Math.abs(x) < 0.01) {
            xd = 0.01;
        }

        return xd;
    }

    tank_RK(x0, u, h) {
        //call 1
        var xd = this.tank_Xdot(x0, u);
        var savex0 = x0;
        var phi = xd;
        var x0 = savex0 + 0.5 * h * xd;

        //call two
        xd = this.tank_Xdot(x0, u);
        phi = phi + 2 * xd;
        x0 = savex0 + 0.5 * h * xd;

        //call three
        xd = this.tank_Xdot(x0, u);
        phi = phi + 2 * xd;
        x0 = savex0 + h * xd;

        //call four
        xd = this.tank_Xdot(x0, u);
        var x = savex0 + (phi + xd) * h / 6;

        return x;
    }

}
