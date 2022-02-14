const {Game} = require("./game");
const {io} = require("../server");
const {getUserById} = require("../users");

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

    playerMovement(movementData){
        this.players[socket.id].x = movementData.x;
        this.players[socket.id].y = movementData.y;
        this.players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    }

}







module.exports = { projectx };