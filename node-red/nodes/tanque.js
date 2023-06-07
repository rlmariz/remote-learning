module.exports = function (RED) {
    "use strict";
    function TanqueNode(n) {
        RED.nodes.createNode(this, n);

        this.interval_id = null;

        this.area = n.area * 1.0;
        this.maxLevel = n.maxLevel * 1.0;
        this.valveK = n.valveK * 1.0;
        this.valveOpen = n.valveOpen * 1.0;
        this.integrationInterval = n.integrationInterval * 1.0;
        this.intervalUpdate = n.intervalUpdate * 1.0;

        this.startLevel = n.startLevel * 1.0;

        this.level = this.startLevel;
        this.inputFlow = 0.0;
        this.outputFlow = 0.0;

        var node = this;

        node.on('input', function (msg) {
            if (msg.payload !== undefined && msg.payload !== null && !isNaN(msg.payload) && msg.payload >= 0)
                node.inputFlow = msg.payload;

            //node.inputFlow = msg.payload;

            if (msg.valveOpen !== undefined && msg.valveOpen !== null && !isNaN(msg.valveOpen))
                node.valveOpen = Math.min(Math.max(msg.valveOpen, 0), 100)
        });

        node.on("close", function () {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
            clearTimeout(node.interval_id);
        });

        node.loadProcess = function () {
            node.interval_id = setInterval(function () {
                //node.warn(["antes", node.level, node.inputFlow, node.outputFlow]);

                node.level = node.Tanque_rk(node.level, node.inputFlow, node.integrationInterval/1000.0) || 0;
                node.level = Math.round(node.level * 1000) / 1000;

                //node.warn(["depois", node.level, node.inputFlow, node.outputFlow]);

                if (node.level == 0) {
                    node.outputFlow = 0;
                }

                if (node.level > node.maxLevel) {
                    node.level = node.maxLevel;
                    node.status({ fill: "red", shape: "dot", text: "full level:" + node.level });
                } else {
                    node.status({ fill: "blue", shape: "dot", text: "level:" + node.level });
                }

                var msg1 = { payload: node.level };
                var msg2 = { payload: node.inputFlow };
                var msg3 = { payload: node.outputFlow };
                node.send([msg1, msg2, msg3]);

            }, node.intervalUpdate);
        }

        node.Tanque_rk = function (x0, u, h) {
            //1a chamada
            var xd = node.Tanque_xdot(x0, u);
            var savex0 = x0;
            var phi = xd;
            var x0 = savex0 + 0.5 * h * xd;
            //node.warn([x0, savex0, h, xd]);

            //2a chamada
            xd = node.Tanque_xdot(x0, u);
            phi = phi + 2 * xd;
            x0 = savex0 + 0.5 * h * xd;

            //3a chamada
            xd = node.Tanque_xdot(x0, u);
            phi = phi + 2 * xd;
            x0 = savex0 + h * xd;

            //4a chamada
            xd = node.Tanque_xdot(x0, u);
            var x = savex0 + (phi + xd) * h / 6;

            return x;
        }

        node.Tanque_xdot = function (x, u) {
            //Differential equations
            node.outputFlow = node.valveK * (node.valveOpen / 100) * Math.sqrt(x);
            var xd = (u - node.outputFlow) / node.area;

            //node.warn([u, node.outputFlow, xd, x]);

            //para evitar erros numéricos (o nivel nao pode ser negativo!)
            //if (Math.abs(x) < 0.001) {
            //    xd = 0.0;
            //}

            return xd;
        }

        node.loadProcess();
    }

    RED.nodes.registerType("tanque", TanqueNode);
}
