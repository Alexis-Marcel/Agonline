const {Game, baseRedirection} = require("./game");
const {io} = require("../server");
const {getUserById} = require("../users");
const { getRandomColorHexa } = require("../color.js");
class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "ProjectX/gamePlayer.html?room=" + this.codeRoom;
        this.socketCreateur.on("start", () => this.startGame());
        this.socketCreateur.on("gameOver", (playerId) => this.majGameOver(playerId));
    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        console.log('a player connected');
        user.rotation = 0;
        user.x = Math.floor(Math.random() * 700) + 50;
        user.y = Math.floor(Math.random() * 500) + 50;
        user.gameOver = false;

        socket.emit("setUp", {x: user.x, y: user.y, rotation: user.rotation, color: "0x" + user.color});
        socket.emit("addPlayer", {x: user.x, y: user.y, rotation: user.rotation, color: "0x" + user.color})
        socket.on('playerMovement', mouvementData => this.playerMovement(user, mouvementData));
        this.socketCreateur.emit('newPlayer', {
            playerId: user.socket.id,
            x: user.x,
            y: user.y,
            rotation: user.rotation,
            color: "0x" + user.color
        });

    }
    removeSocket(socket) {
        super.removeSocket(socket);
        io.emit('disconnectJoueur', socket.id);
        if(this.users.length<2){
            this.endGame();
        }
        else if (this.start && !user.gameOver) { // si le joueur quitte la partie en cours et en vie
            this.nbJoueurEnVie--;
            this.roundEstFini();
        }
    }

    playerMovement(user,movementData){
        user.x = movementData.x;
        user.y = movementData.y;
        user.rotation = movementData.rotation;
        this.socketCreateur.emit('playerMoved',{playerId : user.socket.id, x: user.x, y: user.y, rotation: user.rotation});
    }
    /**
     * lancement du jeu
     */
    startGame() {

        if(this.users.length<2){
            this.socketCreateur.emit("alert", `Le nombre de joueurs est insuffisant pour lancer la partie.`);
            return;
        }

        super.startGame();

        //envoie de l'instruction de départ à tous les joueurs + master
        io.to(this.codeRoom).emit("start");

        this.newRound();

    }

    newRound(){


        this.nbJoueurEnVie = this.users.length;// initialisation du nombre de joueur en vie

        //initialisation du statut de vie de chaque joueur
        this.users.forEach(user => {
            user.gameOver = false;
            console.log( user.gameOver);
        });

        io.to(this.codeRoom).emit("newRound");
    }


     /** mise à jour du statut de vie d'un joueur quand il est touché par un asteroide
     */
    majGameOver(playerId) {
        console.log(playerId);
        let user = getUserById(this.users, playerId);
        console.log(user);
        user.gameOver = true;
        this.nbJoueurEnVie--;

        console.log(user.name + " : dead");

        user.socket.emit("majGameOver",true); // envoie du statut

        this.roundEstFini();
    }

    /**
     * Test de la fin du jeu si il n'y a plus qu'un joueur en vie
     */
    roundEstFini() {

        if (this.nbJoueurEnVie <= 1) {

            const winnerName = this.getWinner();
            this.socketCreateur.emit("affichageScore",(winnerName));
            this.endGame();

        }
    }

    getWinner(){
        const winner = this.users.find( user => !user.gameOver);
        console.log("Winner : "+ winner.name);

        return winner.name;
    }

    endGame(){
        super.endGame();
        io.to(this.codeRoom).emit("endGame");
        console.log(this.codeRoom+" : fin du jeu.")
    }




}



module.exports = { projectx };