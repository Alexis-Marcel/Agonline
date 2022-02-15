const {Game} = require("./game");
const {io, botName} = require("../server");
const {getUserById, removeUser} = require("../users");
const { use } = require("express/lib/application");

class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        console.log('gamePlayer created');
        this.destinationClient = "../ProjectX/gamePlayer.html?room=" + this.codeRoom;
    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        console.log('a player connected');

        user.rotation = 0;
        user.x = Math.floor(Math.random() * 700) + 50;
        user.y = Math.floor(Math.random() * 500) + 50;
        user.team= (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue';

        socket.emit("setUp",{x:user.x, y:user.y, rotation: user.rotation, team : user.team});
        socket.on('playerMovement',mouvementData => this.playerMovement(user,mouvementData));
        this.socketCreateur.emit('newPlayer',{playerId : user.socket.id, x: user.x, y: user.y, rotation: user.rotation});
    }
    removeSocket(socket) {
        super.removeSocket(socket);
        io.emit('disconnectJoueur', socket.id);
        console.log('user disconnected');
    }

    playerMovement(user,movementData){
        user.x = movementData.x;
        user.y = movementData.y;
        user.rotation = movementData.rotation;
        this.socketCreateur.emit('playerMoved',{playerId : user.socket.id, x: user.x, y: user.y, rotation: user.rotation});
    }

}

module.exports = { projectx };