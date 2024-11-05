var socket = io();
var role;
var user_id;

socket.on('automaticMessage', function(msg){
    console.log(msg)
})

socket.on('play_role', function(msg){
    console.log(msg);
    role = msg;
})

socket.on('user_count', function(msg) {
    console.log(msg);
});

window.addEventListener('unload',()=>{
    socket.emit('user_left', user_id.toString());
})