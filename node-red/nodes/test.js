// create a tcp modbus client
const Modbus = require('jsmodbus')
const net = require('net')

var watchdog = 0;
var watchdog_count = 0;
var modbus_ready = false;
var socket;
var client;
var watchdogInterval;
var connectInterval;
var readyInterval;

function createSocket() {

    const socket = new net.Socket()

    socket.on('connect', function () {

        console.log('socket event: connect')

    });

    socket.on('error', function (socket) {
        console.log('socket event: error')
        modbusConnected = false;
    });


    socket.on("close", err => {
        console.log('socket event: close')
        modbusConnected = false;
        modbus_ready = false
    });

    socket.on("end", err => {
        modbusConnected = false;
        modbus_ready = false
        console.log('socket event: end')
    });

    socket.on("ready", err => {
        console.log('socket event: ready')
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


function startModbus() {

    readyInterval = setInterval(function () {
        console.log("modbus_ready: ", modbus_ready)

        if (modbus_ready) {

            client.readHoldingRegisters(0, 4).then(function (resp) {
                const x1 = bufferToFloat(resp.response._body._values, 0);
                //console.log(resp.response._body._values);
                //console.log(resp);
                //console.log(resp.metrics.receivedAt)
                console.log('x1:', x1);
            }).catch(function () {
                console.log('socket event: deu erro')
            })
        }

    }, 500);

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
                    console.log('reiniciar')
                }
                console.log(resp.response._body._values[0]);
                //console.log(resp);
                //console.log(resp.metrics.receivedAt)
                //console.log('x1:', x1);
            }).catch(function (e) {
                console.log('Ocorreu um erro:', e);
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

startModbus()