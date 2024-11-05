var socket = io();
user_id = Math.floor(Math.random()*1000)
socket.emit('id', (user_id).toString())
function send(){
    socket.emit('chat message', "aasd");
    console.log()
}

socket.on('user_count', function(msg) {
    console.log(msg);
});

window.addEventListener('unload',()=>{
    socket.emit('user_left', user_id.toString());
})
    