const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

const int = (n) => Math.floor(n * Math.random());
const choice = (arr) => arr[int(arr.length)];
const choices = (arr, n) =>
    n > 0 ? [choice(arr)].concat(choices(arr, n - 1)) : [];

const COLORS = [
    "blue",
    "mint",
    "green",
    "yellow",
    "peach",
    "orange",
    "red",
    "purple",
    "violet",
];

let globalMsgId = 1;

app.use(express.static(__dirname + '/../dist'));

io.on('connection', (socket) => {
    console.log('a user connected');
    let color = choice(COLORS);
    let msgId = 0;
    socket.emit('hello', { color })
    socket.on('change', (text) => {
        if (msgId == 0) {
            msgId = globalMsgId++;
        }

        if (text.endsWith('\n')) {
            io.emit('typing', {
                id: msgId, color, text: text.slice(0, -1)
            })

            msgId = 0;
            return;
        } else {
            socket.broadcast.emit('typing', {
                id: msgId, color, text
            })
            if(text == "") {
                msgId = 0;
            }
        }
    })
});

server.listen(3030, () => {
    console.log('listening on *:3030');
});