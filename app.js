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
    console.log(`New client connected: ${socket.id}`);
    players.push(socket.id)
    console.log(players)

    setTimeout(() => {
        if (players[0]) {
            io.to(players[0]).emit('automaticMessage', 'Hello, first client! This message is sent automatically.');
        }
    }, 5000); // Sends the message after 5 seconds as an example

    
    if (players.length < 2) {
        socket.emit('play_role', 'player');
    }
    else{
        socket.emit('play_role', 'viewer');
    }



    socket.on('user_left', (msg) =>{
        console.log("user left, id: " + msg);
        players.splice(players.indexOf(msg), 1)
        console.log(players);
    })
});



// Server indítása
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});