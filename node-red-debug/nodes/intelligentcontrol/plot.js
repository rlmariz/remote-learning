module.exports = function (RED) {
    var socket = require('./socket')(RED);

    function PlotNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        node.plot = {
            id: this.id,
            name: node.name || `plot-${node.id}`,            
            label: '',            
            event: '',
            time: 0,
            value: 0,
        };
        
        node.buffer = [];            

        socket.ev.on('newsocket', function () {
            console.log("***** newsocket *******")
            socket.emit('plot', node.buffer)
            // node.buffer.forEach((value) => {
            //     socket.emit('plot', value)
            // });
        })        

        node.on('input', function (msg) {
            msg.payload = msg.payload;

            node.send(msg);        
        
            node.plot.label = msg.label || node.plot.name;

            console.log(`label: ${node.plot.label}`)
        
            if(node.buffer.length == 0){
                node.plot.event = 'reset';
                node.buffer.push(node.plot);
            }

            node.plot.event = 'update';
            node.plot.value = msg.payload;
            node.plot.time = msg.time;
            node.buffer.push(node.plot);

            socket.emit('plot', node.plot)
        });
    }
    RED.nodes.registerType("plot", PlotNode);
}
