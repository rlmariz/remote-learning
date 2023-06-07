'use strict'

const Modbus = require('jsmodbus')
const net = require('net')

let node = {};

node.socket = null;
node.client = null;
node.modbusHost = '192.168.5.143';
node.modbusPort = '502';
node.modbusRegister = 12;
node.modbusConnected = false;

node.loadFromModbus = function () {

  if (node.socket === null) {
    node.socket = new net.Socket();

    node.socket.on('error', function (socket) {
      //node.error(socket);
      console.log("onError says we have someone!");
    }); // console.error                

    node.socket.on("connect", function (socket) {
      console.log("onConnection says we have someone!");
      node.modbusConnected = true;
    });

    node.socket.on("close", err => {
      console.log(`onClose says: ${err}`);
      node.modbusConnected = false;
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
      console.log('Erro');
      //node.error(e); //'Erro on Modbus connect', 
    }
  }

  if (node.socket !== null && node.modbusConnected) {
    node.client.readHoldingRegisters(12, 2).then(function (resp) {
      node.valveOpen = resp.response._body.valuesAsArray[0];
      console.log(node.valveOpen);
    }).catch(function () {
      //node.warn(require('util').inspect(arguments, {depth: null }))
      console.log(require('util').inspect(arguments, { depth: null }));
    })
  }

  setTimeout(() => {
    node.loadFromModbus()
  }, 500);

}

node.loadFromModbus();




