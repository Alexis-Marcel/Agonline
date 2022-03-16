const { Game, baseRedirection } = require("./game");
const { io } = require("../server");
const { getUserById } = require("../users");


const nbRound = 5;

class survival extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "Survival/gamePlayer.html?room=" + this.codeRoom;

        this.socketCreateur.on("score", (playerId, score) => this.majScore(playerId, score));
        this.socketCreateur.on("gameOver", (playerId) => this.majGameOver(playerId));

        this.socketCreateur.on("start", () => this.startGame());

        this.nbRoundRestant = nbRound;

    }

    addUser(socket, name) {

        const user = super.addUser(socket, name);

        // mouvement du joueur
        socket.on('playerMovement', mouvementData => this.socketCreateur.emit('playerMoved', { playerId: user.socket.id, x: mouvementData.x, y: mouvementData.y }));
        this.socketCreateur.emit('newPlayer', { playerId: user.socket.id });// création du joueur

    }

    removeSocket(socket) {
        const user = super.removeSocket(socket);
        this.socketCreateur.emit('disconnectJoueur', socket.id);

        // si le joueur quitte la partie en cours et en vie
        if (this.start && !user.gameOver) {
            this.nbJoueurEnVie--;
            this.jeuEstFini();
        }
    }

    /**
     * lancement du jeu
     */
    startGame() {

        super.startGame();

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

        this.nbJoueurEnVie = this.users.length;// initialisation du nombre de joueur en vie

        //initialisation du score et du statut de vie de chaque joueur
        this.users.forEach(user => {
            user.gameOver = false;
            user.socket.emit("majGameOver",false); // envoie du statut
        });

        this.nbJoueurEnVie = this.users.length;

        io.to(this.codeRoom).emit("newRound");
        this.timer(3,this.startRound);

        this.nbRoundRestant--;
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

        if (this.nbJoueurEnVie == 1) {
            console.log(this.codeRoom+" : fin du round " + (nbRound-this.nbRoundRestant));
            this.socketCreateur.emit("endRound");
            this.timer(3,this.getScore);
        }
    }


    getTabScore() {
        let tab = [];
        this.users.forEach(user => tab.push({ name: user.name, score: user.score }));
        return tab;
    }

    timer(time,callback) {

        let timeleft = time;

        let timerStoper = setInterval(() => {

            if (timeleft <= 0) { 
                
                clearInterval(timerStoper);
                callback(this);
            }

            timeleft -= 1;
        }, 1000);

    }

    /**
     * FONCTION CALLBACK TIMER
     */
    getScore(game) {

        game.socketCreateur.emit("affichageScore", game.getTabScore());
        io.to(game.codeRoom).emit("score");

        game.timer(3,game.encoreUnRound);

    }

    encoreUnRound(game){
        if(game.nbRoundRestant>0){
            game.newRound();
        }
        else {
            game.start = false;
            console.log(game.codeRoom+" : fin du jeu.")
        }
    }
    startRound(game){
        game.socketCreateur.emit("startRound");
    }

     /**
     * FONCTION CALLBACK TIMER
     */

    




}

module.exports = { survival };