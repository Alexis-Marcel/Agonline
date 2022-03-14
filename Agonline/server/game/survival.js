const {Game, baseRedirection} = require("./game");
const {io} = require("../server");
const {getUserById} = require("../users");

class survival extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection+"Survival/gamePlayer.html?room=" + this.codeRoom;

        this.socketCreateur.on("score", (playerId, score) => this.majScore(playerId,score));
        this.socketCreateur.on("gameOver", (playerId) => this.majGameOver(playerId));

        this.socketCreateur.on("start", () => this.startGame());

    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        user.score = 0;
        user.gameOver = false;

        socket.on('playerMovement',mouvementData => this.socketCreateur.emit('playerMoved',{playerId : user.socket.id, x: mouvementData.x, y: mouvementData.y}));
        this.socketCreateur.emit('newPlayer',{playerId : user.socket.id});
        
    }
    removeSocket(socket) {
        const user = super.removeSocket(socket);
        this.socketCreateur.emit('disconnectJoueur', socket.id);

        if(this.start && !user.gameOver){
            this.nbJoueurEnVie--;
            this.jeuEstFini();
        }
    }


    startGame(){
        
        super.startGame();
        this.nbJoueurEnVie = this.users.length;
        
        console.log(this.nbJoueurEnVie);

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

        console.log(user.name + " : dead");

        user.socket.emit("majGameOver");

        this.jeuEstFini();

        
    }

    jeuEstFini(){

        if(this.nbJoueurEnVie == 1){
            console.log("fin de jeu");
            this.socketCreateur.emit("endGame");
        }
    }


}

module.exports = { survival };