const {Game, baseRedirection} = require("./game");
const {io} = require("../server");
const {getUserById} = require("../users");
const { getRandomColorHexa } = require("../color.js");
const nbRound = 3;
const scoreCollectStar = 10;
const scoreSurviveTime = 1;
const scoreWin = 30;

class projectx extends Game {

    constructor(socketCreateur) {
        super(socketCreateur);
        this.destinationClient = baseRedirection + "ProjectX/gamePlayer.html?room=" + this.codeRoom;
        this.socketCreateur.on("start", () => this.startGame());
    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);
        console.log('a player connected');
        user.rotation = 0;
        user.x = Math.floor(Math.random() * 700) + 50;
        user.y = Math.floor(Math.random() * 500) + 50;

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
        console.log('user disconnected');
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

        if(this.users.length<1){
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



module.exports = { projectx };