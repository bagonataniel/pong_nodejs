const express = require('express');
const path = require("path")
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Game state (example)
let gameState = {
    playerId: [],
    players: {},
    "ballposition" : {x: 100, y: 100}
};

function sendGameStateUpdates() {
    io.emit('gameState', gameState);  // Broadcast the updated game state
}

// Function to update game state every 100ms
function updatePlayerMovement(socket) {
    socket.on('movement', (msg) => {
        console.log(msg)
        if (gameState.players[msg.user_id]) {
            gameState.players[msg.user_id].y = msg.playerY;  // Update the player's y-coordinate
            console.log(`Player ${msg.user_id} moved to y=${msg.playerY}`);
        }
    });
}

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    io.to(socket.id).emit('automaticMessage', socket.id);
    let newPlayer = {
        userid: socket.id,
        role: 'left'
    };
    gameState.playerId.push(newPlayer)
    gameState.players[socket.id] = {y: 0};
    console.log(gameState)


    socket.emit('gameState', gameState);

    // Handle movement events for this player
    updatePlayerMovement(socket);




    if (gameState.playerId.length <= 2) {
        gameState.playerId
        socket.emit('play_role', 'player');
    }
    else{
        socket.emit('play_role', 'viewer');
    }

    socket.on('user_left', (msg) =>{
        console.log("user left, id: " + msg);
        // gameState.playerId.delete()
        console.log(gameState.playerId);
    })
});

setInterval(sendGameStateUpdates, 100); // 100ms interval for the loop

// Server indítása
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});