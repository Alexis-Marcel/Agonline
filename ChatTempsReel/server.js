var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 
const SocketAntiSpam  = require('socket-anti-spam')

const port = 80;

app.use(express.static(__dirname));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
})



const socketAntiSpam = new SocketAntiSpam({
  banTime:            1,         // Ban time in minutes
  kickThreshold:      10,          // User gets kicked after this many spam score
  kickTimesBeforeBan: 30,          // User gets banned after this many kicks
  banning:            false,       // Uses temp IP banning after kickTimesBeforeBan
  io:                io,  // Bind the socket.io variable
})

 

io.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('disconnect', function (){
        console.log('a user is disconnected');
    })
    socket.on('chat message', function (msg,name){
        console.log('message recu : ' + msg + ' de '+ name);
        //io.emit('chat message', msg);
        socket.broadcast.emit('chat message',msg,"left",name);
        socket.emit('chat message',msg,"right",name);
    })

})

/*
http.listen(8100,'fd00::3:da25', function(){
    console.log("Server running on "+port);
});*/

http.listen(port, function(){
    console.log("Server running on "+port);
})
