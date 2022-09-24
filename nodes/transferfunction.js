module.exports = function (RED) {

    "use strict";

    const io = require("socket.io-client");

    function TransfFuncNode(n) {
        RED.nodes.createNode(this, n);

        this.inputMin = n.inputMin * 1.0;
        this.inputMax = n.inputMax * 1.0;
        this.outputMin = n.outputMin * 1.0;
        this.outputMax = n.outputMax * 1.0;

        var node = this;

        var tf = {
            name: 'tf-' + node.id,
            func: '8/(8*s**2+s)'
        }

        var tfinput = {
            name: tf.name,
            t: 0,
            y: 0
        }

        let sio = io('http://host.docker.internal:2812', {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'X-Username': node.id
                    }
                }
            }
        });

        sio.on('connect', () => {
            console.log('connected');

            sio.emit('tfset', tf, (result) => {
                console.log(result);
            })
        });

        for (let t = 0; t <= 60; t++) {
            sio.emit('tfinput', tfinput, (result) => {
              console.log(result);

              msg.payload = result.y;
              node.send(msg);

            });
        }

        node.log("Something happened");
        node.warn("Something happened you should know about");
        node.error("Oh no, something bad happened.");

        node.on('input', function (msg) {
            let valueInput = msg.payload;

            msg.payload = valueInput * 5;
            // node.send(msg);

            tfinput.t = tfinput.t + 1;

            sio.emit('tfinput', tfinput, (result) => {
                tfinput.y = result.y;
                msg.payload = tfinput.y;
                node.send(msg);
  
              });            

            if(tfinput.t == 10){
                sio.emit('tfplot', tf, (result) => {
                    console.log(result);
                  });
            }

            node.status({ fill: "blue", shape: "dot", text: "out:" + valueInput });
        });
    }

    RED.nodes.registerType("Transfer Function", TransfFuncNode);
}
