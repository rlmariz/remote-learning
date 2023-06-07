module.exports = function (RED) {
    function SpringNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        console.log(`${node.type} - ${node.id}`)

        node.on('input', function (msg) {
            msg.payload = msg.payload;
            node.send(msg);
        });
    }
    RED.nodes.registerType("spring", SpringNode);
}