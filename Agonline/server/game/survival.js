const { Game, baseRedirection } = require("./game");
const { io } = require("../server");
const { getUserById } = require("../users");
const {rgbToHex} = require("../color.js")


const nbRound = 3;
const scoreCollectStar = 10;
const scoreSurviveTime = 1;
const scoreWin = 30;

class survival extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "Survival/gamePlayer.html?room=" + this.codeRoom;

        this.socketCreateur.on("collectStar", (playerId) => this.majScore(getUserById(this.users, playerId), scoreCollectStar));
        this.socketCreateur.on("gameOver", (playerId,surviveTime) => this.majGameOver(playerId,surviveTime));

        this.socketCreateur.on("start", () => this.startGame());

        this.socketCreateur.on("readyForANewRound", () => this.encoreUnRound());

    }

    addUser(socket, name) {

        const user = super.addUser(socket, name);

        // mouvement du joueur
        socket.on('playerMovement', mouvementData => this.socketCreateur.emit('playerMoved', { playerId: user.socket.id, x: mouvementData.x, y: mouvementData.y }));
        this.socketCreateur.emit('newPlayer', { playerId: user.socket.id , playerColor: "0x"+user.color});// création du joueur
        socket.on('newPlayer', () => socket.emit('newPlayer', { playerColor: "0x"+user.color})); // création du joueur "fictif" coté client


    }

    removeSocket(socket) {
    
        const user = super.removeSocket(socket);
        this.socketCreateur.emit('disconnectJoueur', socket.id);

        if(this.users.length<2){
            this.endGame();
        }
        else if (this.start && !user.gameOver) { // si le joueur quitte la partie en cours et en vie
            this.nbJoueurEnVie--;
            this.roundEstFini();
        }
        
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

        this.nbRoundCourant = 0;

        //initialisation du score  de chaque joueur
        this.users.forEach(user => {
            user.score = 0;
            user.socket.emit("majScore", user.score)
        });



        //envoie de l'instruction de départ à tous les joueurs + master
        io.to(this.codeRoom).emit("start");

        this.newRound();

    }

    newRound(){

        this.nbRoundCourant++;

        console.log(this.codeRoom + " début du round " + (this.nbRoundCourant)+ "/" + nbRound);

        this.socketCreateur.emit("nbRound", (this.nbRoundCourant)+ "/" + nbRound);


        this.nbJoueurEnVie = this.users.length;// initialisation du nombre de joueur en vie

        //initialisation du statut de vie de chaque joueur
        this.users.forEach(user => {
            user.gameOver = false;
            user.socket.emit("majGameOver",false); // envoie du statut
        });

        io.to(this.codeRoom).emit("newRound");
    }

    /**
     * mise à jour du score quand le joueur ramasse une étoile
     */
    majScore(user, score) {
        console.log(user.name +" : score + "+score);
        user.score += score;
        user.socket.emit("majScore", user.score);

    }

    /**
     * mise à jour du statut de vie d'un joueur quand il est touché par une bombe
     */
    majGameOver(playerId,surviveTime) {
        let user = getUserById(this.users, playerId);
        this.majScore(user,surviveTime*scoreSurviveTime);
        user.gameOver = true;
        this.nbJoueurEnVie--;

        console.log(user.name + " : dead");

        user.socket.emit("majGameOver",true); // envoie du statut

        this.roundEstFini(surviveTime);
    }

    /**
     * Test de la fin du jeu si il n'y a plus qu'un joueur en vie
     */
    roundEstFini(surviveTime) {

        if (this.nbJoueurEnVie <= 1) {

            console.log(this.codeRoom+" : fin du round " + (this.nbRoundCourant)+ "/" + nbRound);
            
            const winnerName = this.getWinner(surviveTime);
            this.getScore(winnerName);
        }
    }

    getWinner(surviveTime){
        const winner = this.users.find( user => !user.gameOver);
        console.log("Winner : "+ winner.name);
        this.majScore(winner,scoreWin);
        this.majScore(winner,surviveTime*scoreSurviveTime);

        return winner.name;
    }


    getTabScore() {
        let tab = [];
        this.users.forEach(user => tab.push({ name: user.name, score: user.score }));
        return tab;
    }


    getScore(winnerName) {

        this.socketCreateur.emit("affichageScore", this.getTabScore(),winnerName);
        io.to(this.codeRoom).emit("score");

    }

    encoreUnRound(){
        if(this.nbRoundCourant != nbRound){
            this.newRound();
        }
        else {
            this.endGame()
        
        }
    }

    endGame(){
        super.endGame();
        io.to(this.codeRoom).emit("endGame");
        console.log(this.codeRoom+" : fin du jeu.")
    }



}

module.exports = { survival };