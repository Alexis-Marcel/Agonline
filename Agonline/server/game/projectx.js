const {Game, baseRedirection} = require("./game");
const {io} = require("../server");
const {getUserById} = require("../users");

class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "ProjectX/gamePlayer.html?room=" + this.codeRoom;
    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        console.log('a player connected');
        user.rotation = 0;
        user.x = Math.floor(Math.random() * 700) + 50;
        user.y = Math.floor(Math.random() * 500) + 50;

        socket.emit("setUp",{x:user.x, y:user.y, rotation: user.rotation, color: hex});
        socket.emit("addPlayer",{x:user.x, y:user.y, rotation: user.rotation, color: hex})
        socket.on('playerMovement',mouvementData => this.playerMovement(user,mouvementData));
        this.socketCreateur.emit('newPlayer',{playerId : user.socket.id, x: user.x, y: user.y, rotation: user.rotation, color: "0x"+user.color});
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