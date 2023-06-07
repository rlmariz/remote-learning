// create a tcp modbus client
const Modbus = require('jsmodbus')
const net = require('net')
const EventEmitter = require('events');

const modbusClient = {};

const clientEvent = new EventEmitter();

var watchdog = 0;
var watchdog_count = 0;
var modbus_ready = false;
var socket;
var client;
var watchdogInterval;
var connectInterval;
var readyInterval;


// Função para adicionar um evento ao módulo
modbusClient.on = function (eventName, callback) {
  clientEvent.on(eventName, callback);
};

function createSocket() {

  const socket = new net.Socket()

  socket.on('connect', function () {

    console.log('Modbus socket event: connect')

  });

  socket.on('error', function (socket) {
    console.log('Modbus socket event: error')
    modbusConnected = false;
  });


  socket.on("close", err => {
    console.log('Modbus socket event: close')
    modbusConnected = false;
    modbus_ready = false
  });

  socket.on("end", err => {
    modbusConnected = false;
    modbus_ready = false
    console.log('Modbus socket event: end')
  });

  socket.on("ready", err => {
    console.log('Modbus socket event: ready')
    modbus_ready = true;
  });

  return socket;
}

function createClient(socket) {
  const client = new Modbus.client.TCP(socket, 1)
  return client;
}

const options = {
  'host': 'localhost',
  'port': 502,
  'retryTime': 1000, // 1s for every retry
  'retryAlways': true // retry even if the connection was closed on purpose
}

function bufferToFloat(data, offset) {
  const buf = Buffer.allocUnsafe(4); // (4) is ok
  buf.writeUInt16BE(data[offset]); // high byte
  buf.writeUInt16BE(data[offset + 1], 2); // low byte
  f = buf.readFloatBE(0);
  f = Math.round(f * 1000) / 1000
  return f;
}

function floatToBuffer(data) {
  var buf = Buffer.alloc(4);
  buf.writeFloatBE(data);
  return buf;
}

modbusClient.writeFloat = function (address, data) {

  if (modbus_ready) {

    client.writeMultipleRegisters(address, floatToBuffer(data)).then(() => {
      console.log(`Intervalo ${address} de registros escrito com sucesso data: ${data}`);
    }).catch((error) => {
      console.error('Erro ao escrever no intervalo de registros:', error);
    });

  }

}

modbusClient.writeInt = function (address, data) {

  if (modbus_ready) {

    client.writeSingleRegister(address, data).then(() => {
      console.log(`Endereço ${address} de registros escrito com sucesso: ${data}`);
    }).catch((error) => {
      console.error('Erro ao escrever no intervalo de registros:', error);
    });

  }

}

modbusClient.startModbus = function () {

  readyInterval = setInterval(function () {
    //console.log("modbus_ready: ", modbus_ready)

    if (modbus_ready) {

      client.readHoldingRegisters(0, 38).then(function (resp) {
        const x1 = bufferToFloat(resp.response._body._values, 0);
        const qe = bufferToFloat(resp.response._body._values, 4);
        const qc = bufferToFloat(resp.response._body._values, 8);
        const x2 = bufferToFloat(resp.response._body._values, 16);
        const qs = bufferToFloat(resp.response._body._values, 20);
        const vs = bufferToFloat(resp.response._body._values, 24);
        const ref1 = bufferToFloat(resp.response._body._values, 28);
        const ref2 = bufferToFloat(resp.response._body._values, 32);
        
        let controltype = 'pmc_nn';
        if (resp.response._body._values[36] === 2) {
          controltype = 'pmc';
        }else if(resp.response._body._values[36] === 3){
          controltype = 'rf';
        }

        const started = resp.response._body._values[37];

        //console.log(resp.response._body._values);
        //console.log(resp);
        //console.log(resp.metrics.receivedAt)
        //console.log('x1:', x1);

        clientEvent.emit('data', { x1, qe, qc, x2, qs, ref1, ref2, controltype, started });

      }).catch(function () {
        console.log('Modbus socket event: deu erro')
      })
    }

  }, 1000);

  watchdogInterval = setInterval(function () {

    if (modbus_ready) {

      client.readHoldingRegisters(100, 1).then(function (resp) {
        //const x1 = bufferToFloat(resp.response._body._values, 0);
        if (resp.response._body._values[0] == watchdog) {
          watchdog_count++
        } else {
          watchdog_count = 0
          watchdog = resp.response._body._values[0]
        }

        if (watchdog_count > 3) {
          //socket.resetAndDestroy()
          modbus_ready = false
          watchdog_count = 0
          console.log('Modbus reiniciar client')
        }
        //console.log(resp.response._body._values[0]);
        //console.log(resp);
        //console.log(resp.metrics.receivedAt)
        //console.log('x1:', x1);
      }).catch(function (e) {
        console.log('Modbus Ocorreu um erro:', e);
      })
    }

  }, 500);

  connectInterval = setInterval(function () {

    if (!modbus_ready) {
      socket = createSocket()
      client = createClient(socket)
      socket.connect(options)
    }

  }, 2000);

}

module.exports = modbusClient;