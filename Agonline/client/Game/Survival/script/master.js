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
            debug: false
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

function init() {

    new Phaser.Game(config); // lancement de phaser;
}

var stars;
var bombs;
var platforms;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {

    let self = this;

    this.players = [];

    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    socket.on("start", () => {
        this.physics.pause();
        displayStart();
    });


    socket.on('newPlayer', (playerInfo) => createPlayer(self, playerInfo));

    socket.on('playerMoved', (playerInfo) => movePlayer(self, playerInfo));

    socket.on('disconnectJoueur', (playerId) => {

        let player = self.players.find((player) => (playerId === player.id));
        player.destroy();
        self.players.splice(self.players.indexOf(player), 1);
    });

    socket.on("endRound", () => this.physics.pause());

    socket.on("newRound", () => {

        this.players.forEach((player) => {
            player.gameOver = false;
            player.clearTint();
            player.setPosition(100,450);
        });
        
        $("#game").removeClass("d-none");
        $("#score").addClass("d-none");

        $("#affichageScore div").remove();

    });

    socket.on("startRound", () => {
        this.physics.resume();
    });

    /**
    * afficher le score global
    */
    socket.on("affichageScore", (score) => displayScore(score));


    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 1,
        setXY: { x: 300, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

}


function createPlayer(self, playerInfo) {

    // The player and its settings
    var player = self.physics.add.sprite(100, 450, 'dude');

    player.gameOver = false;

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Collide the player 
    self.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    self.physics.add.overlap(player, stars, collectStar, null, self);

    self.physics.add.collider(player, bombs, hitBomb, null, self);

    player.id = playerInfo.playerId;

    self.players.push(player);

}

function movePlayer(self, playerInfo) {

    var player = self.players.find((p) => p.id === playerInfo.playerId);

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
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
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

function displayScore(score) {

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

