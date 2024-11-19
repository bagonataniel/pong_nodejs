var socket = io("https://pong-nodejs.onrender.com");
var role;
var user_id;

var player = document.querySelector(".control");
const right = document.querySelector(".right")
const left = document.querySelector(".left")
const ball = document.querySelector(".ball")
const score = document.querySelector(".score")
let playerY = 10; // Starting Y position
const speed = 10; // Set player speed

socket.on('automaticMessage', function(msg){
    console.log(msg);
    user_id = msg;
})

socket.on('play_role', function(msg){
    console.log(msg);
    role = msg;
    if (role == "left") {
        left.classList.add("control")
        document.getElementById("up").style.left = 100+"px";
        document.getElementById("down").style.left = 100+"px";
    }
    else if(role == "right"){
        right.classList.add("control")
        document.getElementById("up").style.right = 100+"px";
        document.getElementById("down").style.right = 100+"px";
    }
    else{alert("You are viewer!");}
    player = document.querySelector(".control")
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
    score.innerText = msg.score;
})

// Key press handler
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'w':
        case 'ArrowUp':
            playerY -= speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            if (parseInt(player.style.top) < 0) {document.getElementById("up").classList.add("ct-animate-blink")}
            else{document.getElementById("up").classList.remove("ct-animate-blink")}
            if (parseInt(player.style.top) > 100) {document.getElementById("down").classList.add("ct-animate-blink")}
            else{document.getElementById("down").classList.remove("ct-animate-blink")}
            break;
        case 's':
        case 'ArrowDown':
            playerY += speed;
            userData = {user_id, playerY}
            socket.emit('movement', userData)
            if (parseInt(player.style.top) < 0) {document.getElementById("up").classList.add("ct-animate-blink")}
            else{document.getElementById("up").classList.remove("ct-animate-blink")}
            if (parseInt(player.style.top) > 100) {document.getElementById("down").classList.add("ct-animate-blink")}
            else{document.getElementById("down").classList.remove("ct-animate-blink")}
            break;
    }
});

function clearUsers(){
    socket.emit('clearUsers', user_id)
}
function restartGame(){
    socket.emit('restart')
}