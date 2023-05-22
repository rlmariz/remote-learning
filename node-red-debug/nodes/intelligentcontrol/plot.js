module.exports = function (RED) {
    var socket = require('./socket')(RED);

    function PlotNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var plot = {};
        node.buffer = [];


        socket.ev.on('newsocket', function () {
            console.log("***** newsocket *******")
            node.buffer.forEach((value) => {
                //console.log(value)
                socket.emit('plot', value)
            });
        })        

        plot.name = node.name || `plot-${node.id}`;

        node.on('input', function (msg) {
            msg.payload = msg.payload;

            node.send(msg);        
                       
            plot.value = msg.payload;
            plot.label = msg.label || plot.name;
            plot.time = msg.time;

            node.buffer.push(plot);
            socket.emit('plot', plot)
        });
    }
    RED.nodes.registerType("plot", PlotNode);
}
