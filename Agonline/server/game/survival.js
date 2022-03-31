const { Game, baseRedirection } = require("./game");
const { io } = require("../server");
const { getUserById } = require("../users");
const {rgbToHex} = require("../color.js")


const nbRound = 2;

class survival extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "Survival/gamePlayer.html?room=" + this.codeRoom;

        this.socketCreateur.on("score", (playerId, score) => this.majScore(playerId, score));
        this.socketCreateur.on("gameOver", (playerId) => this.majGameOver(playerId));

        this.socketCreateur.on("start", () => this.startGame());

        this.socketCreateur.on("readyForANewRound", () => this.encoreUnRound());

    }

    addUser(socket, name) {

        const user = super.addUser(socket, name);

        // mouvement du joueur
        socket.on('playerMovement', mouvementData => this.socketCreateur.emit('playerMoved', { playerId: user.socket.id, x: mouvementData.x, y: mouvementData.y }));
        this.socketCreateur.emit('newPlayer', { playerId: user.socket.id , playerColor: "0x"+user.color});// création du joueur

    }

    removeSocket(socket) {
        const user = super.removeSocket(socket);
        this.socketCreateur.emit('disconnectJoueur', socket.id);

        // si le joueur quitte la partie en cours et en vie
        if (this.start && !user.gameOver) {
            this.nbJoueurEnVie--;
            this.roundEstFini();
        }
    }

    /**
     * lancement du jeu
     */
    startGame() {

        super.startGame();

        this.nbRoundRestant = nbRound;

        //initialisation du score et du statut de vie de chaque joueur
        this.users.forEach(user => {
            user.score = 0;
            user.socket.emit("majScore", user.score)
        });



        //envoie de l'instruction de départ à tous les joueurs + master
        io.to(this.codeRoom).emit("start");

        this.newRound();

    }

    newRound(){

        console.log(this.codeRoom + " début du round " + (nbRound-this.nbRoundRestant)+ "/" + nbRound);

        this.nbJoueurEnVie = this.users.length;// initialisation du nombre de joueur en vie

        //initialisation du score et du statut de vie de chaque joueur
        this.users.forEach(user => {
            user.gameOver = false;
            user.socket.emit("majGameOver",false); // envoie du statut
        });

        io.to(this.codeRoom).emit("newRound");
    }

    /**
     * mise à jour du score quand le joueur ramasse une étoile
     */
    majScore(playerId, score) {
        let user = getUserById(this.users, playerId);
        user.score += score;
        user.socket.emit("majScore", user.score);

    }

    /**
     * mise à jour du statut de vie d'un joueur quand il est touché par une bombe
     */
    majGameOver(playerId) {
        let user = getUserById(this.users, playerId);
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

        this.nbRoundRestant--;

        if (this.nbJoueurEnVie <= 1) {
            console.log(this.codeRoom+" : fin du round " + (nbRound-this.nbRoundRestant)+ "/" + nbRound);
            this.getScore();
        }
    }


    getTabScore() {
        let tab = [];
        this.users.forEach(user => tab.push({ name: user.name, score: user.score }));
        return tab;
    }


    getScore() {

        this.socketCreateur.emit("affichageScore", this.getTabScore());
        io.to(this.codeRoom).emit("score");

    }

    encoreUnRound(){
        if(this.nbRoundRestant>0){
            this.newRound();
        }
        else {
            this.start = false;
            io.to(this.codeRoom).emit("endGame");
            console.log(this.codeRoom+" : fin du jeu.")
        }
    }


    




}

module.exports = { survival };