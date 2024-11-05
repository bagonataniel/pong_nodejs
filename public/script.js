var socket = io();
var user_id;
var role;

socket.on('connect', () => {
    console.log('Connected with ID:', socket.id); // This will log the client's unique socket ID
    user_id = socket.id;
});

socket.on('play_role', function(msg){
    console.log(msg);
    role = msg;
})
socket.emit('id', (user_id).toString())

socket.on('user_count', function(msg) {
    console.log(msg);
});

window.addEventListener('unload',()=>{
    socket.emit('user_left', user_id.toString());
})
    