module.exports = function(RED) {
    "use strict";
    function AtuadorNode(n) {
        RED.nodes.createNode(this, n);

        this.inputMin = n.inputMin * 1.0;
        this.inputMax = n.inputMax * 1.0;
        this.outputMin = n.outputMin * 1.0;
        this.outputMax = n.outputMax * 1.0;
        this.inputValueStart = n.inputValueStart * 1.0;

        var node = this;

        const utl = require('./utils')

        node.on('input', function(msg) {
            let valueInput = msg.payload;

            if(valueInput < node.inputMin){
                valueInput = node.inputMin;
            }

            if(valueInput > node.inputMax){
                valueInput = node.inputMax;
            }

            //faz a interpolação linear
            let valueOutput = utl.range(node.inputMin, node.inputMax, node.outputMin, node.outputMax, valueInput);
            msg.payload = valueOutput;
            node.send(msg);

            node.status({fill:"blue",shape:"dot",text:"out:" + valueOutput});
        });

        node.emit("input", { payload: node.inputValueStart });
        
    }

    RED.nodes.registerType("atuador", AtuadorNode);
}
