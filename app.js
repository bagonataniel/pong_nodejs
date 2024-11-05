const express = require('express');
const path = require("path")
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

players = []

io.on('connection', (socket) => {
    socket.on('id', (id) =>{
        console.log('a user connected, id: ' + id);
        players.push(id)
        io.emit('user_count', players.length.toString())
    })

    socket.on('user_left', (msg) =>{
        console.log("user left, id: " + msg);
    })
});



// Server indítása
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});