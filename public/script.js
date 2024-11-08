var socket = io();
var role;
var user_id;

socket.on('movement', function(msg){
    console.log(msg)
})

socket.on('automaticMessage', function(msg){
    console.log(msg);
    user_id = msg;
})

socket.on('play_role', function(msg){
    console.log(msg);
    role = msg;
})


window.addEventListener('unload',()=>{
    socket.emit('user_left', user_id.toString());
})


const player = document.querySelector(".control");
const right = document.querySelector(".right")
const left = document.querySelector(".left")

socket.on('gameState', function(msg){
    left_player = "";
    right_player = "";
    for (let index = 0; index < msg.playerId.length; index++) {
        if (msg.playerId[index].role == "left") {
            left_player = msg.playerId
        }
    }
    playerY = msg.players[user_id].y
    left.style.top = msg.players[msg.playerId["left"]].y+"px"
})

let playerY = 100; // Starting Y position

// Set player speed
const speed = 50;

// Key press handler
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            playerY -= speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            break;
        case 'ArrowDown':
            playerY += speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            break;
        case 'w':
            playerY -= speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            break;
        case 's':
            playerY += speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            break;
    }
});