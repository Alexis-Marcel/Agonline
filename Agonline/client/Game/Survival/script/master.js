import { initMaster } from "../../scriptGlobal/global.js";

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: game,
        width: 800,
        height: 600,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
    }
};

const socket = io();
const gameName = "survivalGame";
const codeRoom = initMaster(socket, init, gameName);
const SECONDE = 1000;
const TimeRoundStart = 3;
const StartWord = "Survive !"

function init() {

    new Phaser.Game(config); // lancement de phaser;
}

var stars;
var bombs;
var platforms;
var players;
var startCountText;
let timer;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {

    let self = this;

     //  A simple background for our game
     this.add.image(400, 300, 'sky');

     createPlatforms(self);

    players = this.physics.add.group(); 
    getAnimation(self);

    stars = this.physics.add.group();    

    bombs = this.physics.add.group();

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);


    createStartRoundText(self);

    socket.on("start", () => {
        this.physics.pause();
        displayStart();
    });

    socket.on('newPlayer', (playerInfo) => createPlayer(self, playerInfo));

    socket.on('playerMoved', (playerInfo) => movePlayer(playerInfo));

    socket.on('disconnectJoueur', (playerId) => disconnectPlayer(playerId));

    socket.on("newRound", () => startRoundSetUp(self));

    socket.on("endGame", () =>{

        $("#start-button").on("click", function () {
            socket.emit("start");
        });
        $("#start-button").removeClass("d-none");
    });

    /**
    * afficher le score global
    */
    socket.on("affichageScore", (score) => endRound(score,self));



}

function startRoundSetUp(self){

    spawnEtoile();

    bombs.clear(true,true); // suppresion de toute les bombes

    players.getChildren().forEach((player) => {

        player.gameOver = false;
        player.tint = player.color;

        player.setPosition(spawnAleatoireX(),spawnAleatoireY());
    });

    
    $("#game").removeClass("d-none");
    $("#score").addClass("d-none");

    
    timer = self.time.addEvent({
        delay: 1*SECONDE,                
        callback: startRoundText,
        callbackScope: self,
        repeat: TimeRoundStart+1
    });
}

function startRoundText(){
    startCountText.visible = true;
    let timesLeft = timer.getRepeatCount()-1;
    if(timesLeft == 0){
        startCountText.setText(StartWord);
        this.physics.resume();
    }
    else if (timesLeft == -1){
        startCountText.visible = false;
    }
    else {
        startCountText.setText(timesLeft);
    }

}

function createStartRoundText(self){

    var style = { font: "bold 60px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    const screenCenterX = self.cameras.main.worldView.x + self.cameras.main.width / 2;
    const screenCenterY = self.cameras.main.worldView.y + self.cameras.main.height / 2;
    startCountText = self.add.text(screenCenterX, screenCenterY, '',style).setOrigin(0.5);
    startCountText.visible = false;
}

function spawnAleatoireX(){
    return Phaser.Math.Between(0, 790);
}

function spawnAleatoireY(){
    return Phaser.Math.Between(0, 512);
}

function createPlatforms(self){

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = self.physics.add.staticGroup();


    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

function spawnEtoile(){

    stars.clear(true,true); // suppresion de toute les bombes

    let nbEtoile = Phaser.Math.Between(1,players.getChildren().length);
        for (let index = 0; index < nbEtoile; index++) {
            stars.create(spawnAleatoireX(), spawnAleatoireY(),'star');
        }

        stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
        });
}
function createPlayer(self,playerInfo) {

    // The player and its settings
    let player = players.create(100, 450, 'dude');
    
    //perfect hitbox
    player.setSize(25,40);
    player.setOffset(4,8);

    player.gameOver = false;

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Collide the player 
    self.physics.add.collider(player, platforms);

    self.physics.add.collider(player,players)

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    self.physics.add.overlap(player, stars, collectStar, null, self);

    self.physics.add.collider(player, bombs, hitBomb, null, self);


    player.color = playerInfo.playerColor;
    player.id = playerInfo.playerId;

    

}

function disconnectPlayer(playerId){

    let player = players.find((player) => (playerId === player.id));
        player.destroy();
        players.splice(players.indexOf(player), 1);
}

function movePlayer(playerInfo) {

    var player = players.getChildren().find((p) => p.id === playerInfo.playerId);

    if (player.gameOver) {
        return;
    }

    if (playerInfo.x == "left") {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (playerInfo.x == "right") {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (playerInfo.y == "up" && player.body.touching.down) {
        player.setVelocityY(-330);
    }

}


function collectStar(player, star) {

    if(player.gameOver){
        return;
    }

    star.disableBody(true, true);

    socket.emit("score", player.id, 10);

    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        
        spawnEtoile();

        var bomb = bombs.create(spawnAleatoireX(), 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        
    }
}

function hitBomb(player, bomb) {

    if(player.gameOver){
        return;
    }

    player.gameOver = true;

    player.setTint(0xff0000);

    player.setVelocityX(0);
    player.anims.play('turn');

    socket.emit("gameOver", player.id);
}

function endRound(score,self){
    self.physics.pause();
    self.time.delayedCall(3*SECONDE, displayScore, [score], self); 
}

function displayScore(score) {

    $("#affichageScore div").remove();//suppresion de l'ancien score

    /**
     * trie du score selon le score décroissant
     */
    score.sort(function (a, b) {
        return b.score - a.score;
    })

    let compte = 1;
    score.forEach(joueur => {
        const num = $("<div></div>").text(compte);
        const name = $("<div></div>").text(joueur.name);
        let point;
        if (joueur.score <= 1) {
            point = $("<div></div>")
                .text(joueur.score + " point");
        }
        else {
            point = $("<div></div>")
                .text(joueur.score + " points");
        }
        const scoreJoueur = $("<div></div>")
            .append(num)
            .append(name)
            .append(point)
            .addClass("d-flex")
            .addClass("justify-content-between")
            .addClass("align-items-center");
        $("#affichageScore")
            .append(scoreJoueur)
            .scrollTop(function () {
                return this.scrollHeight;
            });

        compte++;
    });
    $("#game").addClass("d-none");
    $("#score").removeClass("d-none");

    this.time.delayedCall(3*SECONDE, readyForANewRound); 

}

function readyForANewRound(){
    socket.emit("readyForANewRound",);
}

function getAnimation(self){

    //  Our player animations, turning, walking left and walking right.
    self.anims.create({
        key: 'left',
        frames: self.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    self.anims.create({
        key: 'right',
        frames: self.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

}

function displayStart() {
    $("#waitMessage").addClass("d-none");
    $("#start-button").off("click");
    $("#start-button").addClass("d-none");
}


function copy() {

    $("#codeRoom").select();
    document.execCommand("copy");
}

$("#copy").on("click", copy);

