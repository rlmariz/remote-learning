module.exports = function (RED) {
    "use strict";
    function TanqueNode(n) {
        RED.nodes.createNode(this, n);

        this.interval_id = null;
        this.intervalModbus_id = null;
        this.socket = null;
        this.client = null;

        this.area = n.area * 1.0;
        this.maxLevel = n.maxLevel * 1.0;
        this.valveK = n.valveK * 1.0;
        this.valveOpen = n.valveOpen * 1.0;
        this.integrationInterval = n.integrationInterval * 1.0;
        this.modbusHost = n.modbusHost;
        this.modbusPort = n.modbusPort * 1.0;
        this.modbusRegister = n.modbusRegister * 1.0;
        this.intervalUpdate = n.intervalUpdate * 1.0;

        this.startLevel = n.startLevel * 1.0;

        this.level = this.startLevel;
        this.inputFlow = 0.0;
        this.outputFlow = 0.0;

        var node = this;

        // create a tcp modbus client
        const Modbus = require('jsmodbus')
        const net = require('net')

        node.on('input', function (msg) {
            node.inputFlow = msg.payload;
        });

        node.on("close", function () {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
            clearTimeout(node.interval_id);
            clearTimeout(node.intervalModbus_id);
            if (node.modbusConnected) {
                node.socket.end();
            }
            delete node.client;
            delete node.socket;
        });

        node.loadProcess = function () {
            node.interval_id = setInterval(function () {
                node.level = node.Tanque_rk(node.level, node.inputFlow, node.integrationInterval) || 0;
                node.level = Math.round(node.level * 1000) / 1000;

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
                var msg2 = { payload: node.outputFlow };
                var msg3 = { payload: node.inputFlow };
                node.send([msg1, msg2, msg3]);

            }, node.intervalUpdate);
        }

        node.loadFromModbus = function () {

            if (node.socket === null) {
                node.socket = new net.Socket();

                node.socket.on('error', function (socket) {
                    node.modbusConnected = false;
                });

                node.socket.on("connect", function (socket) {
                });

                node.socket.on("close", err => {
                    node.modbusConnected = false;
                });

                node.socket.on("end", err => {
                    node.modbusConnected = false;
                });

                node.socket.on("ready", err => {
                    node.client.writeSingleRegister(node.modbusRegister, Math.trunc(node.valveOpen))
                        .then(function (resp) {
                            node.modbusConnected = true;
                        }).catch(function () {
                            node.error(arguments);
                        })

                });
            }

            if (node.socket !== null && node.client === null) {
                node.client = new Modbus.client.TCP(node.socket, 1)
            }

            if (!node.modbusConnected) {
                try {
                    node.socket.connect({
                        'host': node.modbusHost,
                        'port': node.modbusPort,
                        'autoReconnect': true
                    })
                } catch (e) {
                    node.error(e); //'Erro on Modbus connect', 
                }
            }

            node.intervalModbus_id = setInterval(function () {

                if (node.modbusConnected) {
                    node.client.readHoldingRegisters(node.modbusRegister, 1).then(function (resp) {
                        node.valveOpen = resp.response._body.valuesAsArray[0];
                    }).catch(function () {
                        node.warn(require('util').inspect(arguments, { depth: null }))
                    })
                }

            }, 500);

        }

        node.Tanque_rk = function (x0, u, h) {
            //1a chamada
            var xd = node.Tanque_xdot(x0, u);
            var savex0 = x0;
            var phi = xd;
            var x0 = savex0 + 0.5 * h * xd;

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

            //node.warn([u, node.outputFlow, xd]);

            //para evitar erros numéricos (o nivel nao pode ser negativo!)
            if (Math.abs(x) < 0.01) {
                xd = 0.01;
            }

            return xd;
        }

        if (node.modbusHost !== "" && node.modbusPort !== null && node.modbusPort > 0 && node.modbusRegister !== null && node.modbusRegister > 0) {
            node.loadFromModbus();
        }

        node.loadProcess();
    }

    RED.nodes.registerType("tanque", TanqueNode);
}
