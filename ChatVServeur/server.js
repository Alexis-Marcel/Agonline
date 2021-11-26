var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

const port = 80;

app.use(express.static(__dirname));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
})



io.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('disconnect', function (){
        console.log('a user is disconnected');
    })
    socket.on('chat message', function (msg){
        console.log('message recu : ' + msg);
        //io.emit('chat message', msg);
        socket.broadcast.emit('chat message',msg,"left");
        socket.emit('chat message',msg,"right");
    })

})

http.listen(8100,'fd00::3:da25', function(){
    console.log("HelloWorld server is started")
});

/*http.listen(port, function(){
    console.log("Server running on "+port+" avec nodemon")
})*/
