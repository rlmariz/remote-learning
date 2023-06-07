
module.exports = function(RED) {
    "use strict";
    var Controller = require('node-pid-controller');

    function PIDcontrolNode(n) {
        RED.nodes.createNode(this,n);
        this.target = n.target;
        this.kp = n.kp * 1.0;
        this.ki = n.ki * 1.0;
        this.kd = n.kd * 1.0;
        this.intervalTime = n.intervalTime * 1.0;
        var node = this;
        node.ctr = new Controller(node.kp, node.ki, node.kd, node.intervalTime);
        node.ctr.setTarget(node.target);
        this.status({fill:"blue",shape:"dot",text:"set point:"+node.target});
        var tgt = node.target;

        this.on("input",function(msg) {
            if (msg.hasOwnProperty("setpoint")) {
                tgt = Number(msg.setpoint);
                node.ctr.setTarget(tgt);
                this.status({fill:"blue",shape:"dot",text:"set point:"+tgt});
            }
            else if (!isNaN(msg.payload)) {
                msg.payload = node.ctr.update(Number(msg.payload));
                msg.topic = "pid";
                node.send(msg);
            }
            else { node.warn("Non numeric input"); }
        });
    }
    RED.nodes.registerType("PID control",PIDcontrolNode);
}
