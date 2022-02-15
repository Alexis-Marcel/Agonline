const {Game} = require("./game");
const {io, botName} = require("../server");
const {getUserById, removeUser} = require("../users");

class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        console.log('gamePlayer created');
        this.players = {};
        this.socketCreateur.on("playerMovement", () => this.playerMovement(movementData));
        this.socketCreateur.on("start", () => this.setUpStart());
    }

    addUser(socket, name) {
        super.addUser(socket, name);
        console.log('a player connected');
        this.players[socket.id] = {
            rotation: 0,
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            playerId: socket.id,
            team: (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue'
        };
        socket.emit('currentPlayers', this.players);
        socket.broadcast.emit('newPlayer', this.players[socket.id]);
    }
    removeSocket(socket) {
        super.removeSocket(socket);
        delete this.players[socket.id];
        io.emit('disconnectJoueur', socket.id);
        console.log('user disconnected');
    }

    playerMovement(movementData){
        this.players[socket.id].x = movementData.x;
        this.players[socket.id].y = movementData.y;
        this.players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    }

}

/*
const {Game} = require("./game");
const {io, botName} = require("../server");
const {getUserById, removeUser} = require("../users");

class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        console.log('gamePlayer created');
        this.socketCreateur.on("playerMovement", () => this.playerMovement(movementData));
        this.socketCreateur.on("start", () => this.setUpStart());
    }

    addUser(socket, name) {
        super.addUser(socket, name);
        console.log('a player connected');
        getUserById(this.users, socket.id).rotation = 0;
        getUserById(this.users, socket.id).x = Math.floor(Math.random() * 700) + 50;
        getUserById(this.users, socket.id).y = Math.floor(Math.random() * 500) + 50;
        getUserById(this.users, socket.id).playerId= socket.id;
        getUserById(this.users, socket.id).team = (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue';
        console.log(this.users);
       socket.emit('currentPlayers', this.users);
      // socket.broadcast.emit('newPlayer',  getUserById(this.users, socket.id));
    }

    playerMovement(movementData){
        getUserById(this.users, socket.id).x = movementData.x;
        getUserById(this.users, socket.id).y = movementData.y;
        getUserById(this.users, socket.id).rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved',  getUserById(this.users, socket.id));
    }

}

module.exports = { projectx };
 */





module.exports = { projectx };