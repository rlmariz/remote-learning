const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const modbusClient = require('./modbusClient.js');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configure o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Inicie o servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado no Socket');

    socket.on('ref', (data) => {
        console.log(data);

        if (data.ref1 !== undefined && data.ref1 !== null && !isNaN(data.ref1) && data.ref1 >= 1 && data.ref1 <= 11)
            modbusClient.writeFloat(28, data.ref1)

        if (data.ref2 !== undefined && data.ref2 !== null && !isNaN(data.ref2) && data.ref2 >= 1 && data.ref2 <= 11)
            modbusClient.writeFloat(32, data.ref2)

        if (data.control_type !== undefined && data.control_type !== null && data.control_type === 'pmc_nn') {
            modbusClient.writeInt(36,1)
        }

        if (data.control_type !== undefined && data.control_type !== null && data.control_type === 'pmc') {
            modbusClient.writeInt(36,2)
        }

        if (data.control_type !== undefined && data.control_type !== null && data.control_type === 'rf') {
            modbusClient.writeInt(36,3)
        }

        modbusClient.writeInt(37,1)

        io.emit('ref', data)
    });

});

modbusClient.on('data', (data) => {
    io.emit('data', data);
});

modbusClient.startModbus()