const {Game} = require("./game");
const {io, botName} = require("../server");
const {getUserById, removeUser} = require("../users");
const { use } = require("express/lib/application");
const { rgbToHex} = require("../color.js");

class survival extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        console.log('survival created');
        this.destinationClient = "../Survival/gamePlayer.html?room=" + this.codeRoom;

        this.socketCreateur.on("score", (playerId, score) => this.majScore(playerId,score));
        this.socketCreateur.on("gameOver", (playerId) => this.majGameOver(playerId));

        this.socketCreateur.on("start", () => this.startGame());

    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        user.score = 0;
        user.gameOver = false;
        this.nbJoueurEnVie++;
        console.log('a player connected');

        socket.on('playerMovement',mouvementData => this.socketCreateur.emit('playerMoved',{playerId : user.socket.id, x: mouvementData.x, y: mouvementData.y}));
        this.socketCreateur.emit('newPlayer',{playerId : user.socket.id});
        
    }
    removeSocket(socket) {
        const user = super.removeSocket(socket);
        this.socketCreateur.emit('disconnectJoueur', socket.id);

        if(!user.gameOver){
            this.nbJoueurEnVie--;
            this.jeuEstFini();
        }
    }


    startGame(){
        
        super.startGame();
        this.nbJoueurEnVie = 0;

        this.users.forEach(user => {
            user.score = 0;
            user.gameOver = false;
            user.socket.emit("majScore", user.score)
        });

        io.to(this.codeRoom).emit("start");
    }

    majScore(playerId,score){
        let user = getUserById(this.users,playerId);
        user.score += score;
        user.socket.emit("majScore", user.score);

    }

    majGameOver(playerId){
        let user = getUserById(this.users,playerId);
        user.gameOver = true;
        this.nbJoueurEnVie--;

        user.socket.emit("majGameOver");

        this.jeuEstFini();

        
    }

    jeuEstFini(){

        if(this.nbJoueurEnVie <2){
            console.log("fin de jeu");
            this.socketCreateur.emit("endGame");
        }
    }


}

module.exports = { survival };