const io = require("socket.io-client");

var sio = io('http://127.0.0.1:2812', {
    transportOptions: {
        polling: {
            extraHeaders: {
                'X-Username': 'ui'
            }
        }
    }
});

sio.on('connect', () => {
    console.log('connected');
    sio.emit('sum', { numbers: [1, 2] }, (result) => {
        console.log(result);
    });
});

sio.on('connect_error', (e) => {
    console.log(e.message);
});

sio.on('disconnect', () => {
    console.log('disconnected');
});

sio.on('mult', (data, cb) => {
    dir
    const result = data.numbers[0] * data.numbers[1];
    cb(result);
});

sio.on('client_count', (count) => {
    console.log('There are ' + count + ' connected clients.');
});

sio.on('room_count', (count) => {
    console.log('There are ' + count + ' clients in my room.');
});

sio.on('user_joined', (username) => {
    console.log('User ' + username + ' has joined.');
});

sio.on('user_left', (username) => {
    console.log('User ' + username + ' has left.');
});

const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:2812')

ws.on("connection", () => {
    console.log("Connected")
 });

ws.addEventListener('message', message => {
    console.log('message')
})

ws.onopen = function(e) {
    console.log('open')
    ws.send('abc');
};

// ws.onmessage = function(data) { 
//     console.log(data);
// }

while (ws.readyState == WebSocket.CLOSED) {
    // Do your stuff...
}

//ws.send('abc');


// if (yourWsObject.readyState !== WebSocket.CLOSED) {
//     // Do your stuff...
//  }


