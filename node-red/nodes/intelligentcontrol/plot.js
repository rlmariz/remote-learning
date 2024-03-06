module.exports = function (RED) {
    var socket = require('./socket')(RED);

    function PlotNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.buffer = [];

        socket.ev.on('newsocket', function () {
            console.log("***** newsocket *******")
            socket.emit('plot', node.buffer)
        })

        node.on('input', function (msg) {
            msg.payload = msg.payload;

            node.send(msg);

            let plot = {
                id: this.id,
                name: node.name || `plot-${node.id}`,
                label: msg.label || node.name || `plot-${node.id}`,
                event: 'update',
                time: msg.time,
                value: msg.payload
            };

            if (node.buffer.length == 0) {
                let plotReset = {
                    id: this.id,
                    event: 'reset'
                };
                node.buffer.push(plotReset);
                socket.emit('plot', plotReset)
            }

            node.buffer.push(plot);

            socket.emit('plot', plot)
        });
    }
    RED.nodes.registerType("plot", PlotNode);
}
