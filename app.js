const express = require('express');
const path = require("path");
const http = require('http');
const { Server } = require("socket.io");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io server with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "https://bago-pong.netlify.app", // Update with your Netlify frontend URL
    methods: ["GET", "POST"],
  },
});

// Game state (example)
let gameState = {
    players: [],
    ballposition : {x: 10, y: 10}
};
ballspeed = 0.5;

function sendGameStateUpdates() {
    io.emit('gameState', gameState);  // Broadcast the updated game state
    if (gameState.players.length >= 2) {
        moveBall();
    }
}

// Function to update game state every 100ms
function updatePlayerMovement(socket) {
    socket.on('movement', (msg) => {
        for (let index = 0; index < gameState.players.length; index++) {
            if (gameState.players[index].id == msg.user_id) {
                gameState.players[index].y = msg.playerY
                console.log(`Player ${msg.user_id} moved to y=${msg.playerY}, ball position: ${gameState.ballposition.x}`);
            }
        }
    });
}

function moveBall(){
    gameState.ballposition = {
        x: gameState.ballposition.x+ballspeed,
        y: gameState.ballposition.y+(ballspeed/2)
    }
    /* jobb oldal */
    if (gameState.ballposition.x+5 >= 99 /* bal oldala */ && gameState.ballposition.y >= gameState.players.find(player => player.role === 'right').y /* felso */
    && gameState.ballposition.y <= gameState.players.find(player => player.role === 'right').y+30 /* also */) {
        ballspeed = -ballspeed
    }
    /*bal oldal*/
    if(gameState.ballposition.x <= 1 /* jobb oldal */ && gameState.ballposition.y >= gameState.players.find(player => player.role === 'left').y /* felso */
            && gameState.ballposition.y <= gameState.players.find(player => player.role === 'left').y+30 /* also */){
        ballspeed = -ballspeed
    }
}

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    io.to(socket.id).emit('automaticMessage', socket.id);

    let newplayer = {
        id: socket.id,
        y: 10, 
        role: "none"}
    gameState.players.push(newplayer)
    console.log(gameState)

    if (gameState.players.length >= 2) {
        gameState.players[0].role = 'left';
        gameState.players[1].role = 'right';
        for (let index = 2; index < gameState.players.length; index++) {
            gameState.players[index].role = 'viewer'
        }
        for (let index = 0; index < gameState.players.length; index++) {
            io.to(gameState.players[index].id).emit('play_role', gameState.players[index].role);
        }
    }
    else{
        console.log("waiting for one or more players")
    }

    socket.emit('gameState', gameState);

    // Handle movement events for this player
    updatePlayerMovement(socket);

    socket.on('user_left', (msg) =>{
        console.log("user left, id: " + msg);
        gameState.players = gameState.players.filter(player => player.id !== msg);
    })
});

setInterval(sendGameStateUpdates, 33); // 33ms (around 30fps) interval for the loop

// Server indítása
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});