module.exports = function (RED) {
    function MassNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        //RED.allUpstreamNodes

        //let allUpstreamNodes = RED.allUpstreamNodes(node);
        //let nodeid = RED.nodes.node(node.id);
        // let allConnectedNodes = RED.nodes.getAllFlowNodes(nodeid)
        //let allConnectedNodes = RED.nodes.getAllFlowNodes(node)

        // let results = [];
        // RED.nodes.eachNode(function (node) {
        //     console.log(node.name)            
        // });


        console.log(this.wires)

        //var node = RED.nodes.getNode(this.id);  // Substitua 'nodeId' pelo ID do nó desejado


        node.on('input', function (msg) {
            msg.payload = msg.payload;
            node.send(msg);
        });
    }
    RED.nodes.registerType("mass", MassNode);
}