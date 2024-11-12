var socket = io("https://pong-nodejs.onrender.com");
var role;
var user_id;

const player = document.querySelector(".control");
const right = document.querySelector(".right")
const left = document.querySelector(".left")
const ball = document.querySelector(".ball")

socket.on('automaticMessage', function(msg){
    console.log(msg);
    user_id = msg;
})



socket.on('play_role', function(msg){
    console.log(msg);
    role = msg;
    if (role == "left") {
        left.classList.add("control")
    }
    else if(role == "right"){
        right.classList.add("control")
    }
    else{
        alert("You are viewer!");
    }
})

// sends data when the user leaves
window.addEventListener('unload',()=>{
    socket.emit('user_left', user_id.toString());
})


socket.on('gameState', function(msg){
    for (let index = 0; index < msg.players.length; index++) {
        if (msg.players[index].role == "left") {
            left.style.top = msg.players[index].y+"%"
        }
        else if(msg.players[index].role == "right"){
            right.style.top = msg.players[index].y+"%"
        }
    }
    ball.style.left = msg.ballposition.x+"%";
    ball.style.top = msg.ballposition.y+"%";
})

let playerY = 10; // Starting Y position

// Set player speed
const speed = 10;

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

function clearUsers(){
    socket.emit('clearUsers', user_id)
}