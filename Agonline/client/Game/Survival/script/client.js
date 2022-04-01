import VirtualJoystickPlugin from '/phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { initClient } from "../../scriptGlobal/global.js";

const width = window.innerWidth;
const height = window.innerHeight*0.95;
console.log(width + " " + height);
var config = {
    type: Phaser.AUTO,
    transparent: true,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: game,
        width: width,
        height: height,
    },
    plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
        },
        ]
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const socket = io();

let playerInfo;

initClient(socket,start,init);

function init(){
    var gamePlayer = new Phaser.Game(config);
    socket.emit("newPlayer");
    socket.on("newPlayer", (info) =>playerInfo = info );
}


function start() {

    $("#waitMessage").addClass("d-none");
    $("#game").removeClass("d-none");
}

var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var player;

function preload() {
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {


    let self = this;

    //cursors = this.input.keyboard.createCursorKeys();

    var joystick = this.plugins.get('rexVirtualJoystick').add(this, {
        x: width/2,
        y: height*0.75,
        radius: 100,
        // dir: '8dir',
        // forceMin: 16,
        // fixed: true,
        // enable: true
    });

    cursors = joystick.createCursorKeys();

    //  The score
    var style = { font: "32px", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    scoreText = this.add.text(width/2, 20, 'Score: 0', style).setOrigin(0.5);

    createPlayer(self,playerInfo);
    

    socket.on("majScore", (newScore) => {
        //  Add and update the score
        score = newScore;
        scoreText.setText('Score: ' + score);
    });

    socket.on("majGameOver", (statut) => gameOver = statut);

    /**
      * affichage score
      */
     socket.on("score", () => getScore());


     socket.on("newRound", () => {
        
        $("#game").removeClass("d-none");
        $("#waitRound").addClass("d-none");

    });

    socket.on("endGame", () => {
        $("#waitMessage").removeClass("d-none");
        $("#waitRound").addClass("d-none");
    });


    getAnimation(self);

}


function createPlayer(self,playerInfo){

    player = self.add.sprite(0, 0, 'dude');
    console.log(player);
    player.setScale(2);
    player.setTint(playerInfo.playerColor);
    player.setPosition(width/2,height*0.25);

   
}

var movementX;
var movementY;

function update() {


    var leftKeyDown = cursors.left.isDown;
    var rightKeyDown = cursors.right.isDown;
    var upKeyDown = cursors.up.isDown;

    if (gameOver) {
        return;
    }

    if (upKeyDown) {
        movementY = "up";
    }
    else {
        movementY = "none";
    }


    if (leftKeyDown) {
        movementX = "left";
        player.anims.play('left', true);

    }
    else if (rightKeyDown) {
        movementX = "right";
        player.anims.play('right', true);

    }
    else if (movementX === "turn") {
        return;
    }
    else {
        movementX = "turn";
        player.anims.play('turn');
    }

    console.log("update mouvement")
    socket.emit('playerMovement', { x: movementX, y: movementY });




    /*
    if (cursors.up.isDown)
    {
        movementY = "up";
    }
    else movementY = "none";

    if (cursors.left.isDown)
    {
        movementX = "left";

    }
    else if (cursors.right.isDown)
    { 
        movementX = "right";

    }
    else{
        movementX = "turn";
    }*/

    //console.log("update mouvement")
    //socket.emit('playerMovement', { x: movementX, y: movementY}); 

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

function getScore(end) {

    $("#game").addClass("d-none");

    $("#waitRound").removeClass("d-none");
    
}

