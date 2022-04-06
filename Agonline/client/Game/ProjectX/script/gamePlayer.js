import VirtualJoystickPlugin from '/phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { initClient } from "../../scriptGlobal/global.js";

const width = window.innerWidth;
const height = window.innerHeight*0.95;

const config = {
    type: Phaser.AUTO,
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: game,
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


var gameOver;
var playerInfo;
var cursors;
var scoreText;
var player;

socket.on("addPlayer",(p)=> {
        playerInfo = p;
    }
)


function preload() {
    this.load.image('ship', '../../assets/images/enemyBlack5.png')
    this.canvas = this.sys.game.canvas;
}

function create() {


    self = this;

    var joystick = this.plugins.get('rexVirtualJoystick').add(this, {
        x: width/2,
        y: height*0.75,
        radius: 100,
        // dir: '8dir',
        // forceMin: 16,
        // fixed: true,
        // enable: true
    });

    this.cursors = joystick.createCursorKeys();

    addPlayer(self,playerInfo);

    socket.on("taille", (w,h) => {
        this.physics.world.setBounds(0, 0, w, h);
    });
    //socket.on("score", () => getScore());
    socket.on("newRound", () => {

        $("#game").removeClass("d-none");
        $("#waitRound").addClass("d-none");

    });

    getAnimation(self);

}

function addPlayer(self,playerInfo) {
    player = self.add.sprite(0, 0, 'ship');
    console.log(player);
    player.setScale(2);
    player.setTint(playerInfo.color);
    player.setPosition(width/2,height*0.25);

}

var movementX;
var movementY;

function update() {

    var leftKeyDown = this.cursors.left.isDown;
    var rightKeyDown = this.cursors.right.isDown;
    var upKeyDown = this.cursors.up.isDown;

    if(gameOver){
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

        let x = player.x;
        let y = player.y;
        let r = player.rotation;
        if (player.oldPosition && (x !== player.oldPosition.x || y !== player.oldPosition.y || r !== player.oldPosition.rotation)) {
            console.log("mouvement update");
            socket.emit('playerMovement', { x: player.x, y: player.y, rotation: player.rotation });
        }
    // save old position data
        player.oldPosition = {
            x: player.x,
            y: player.y,
            rotation: player.rotation
        };
}

function getAnimation(self){

    //  Our player animations, turning, walking left and walking right.
    self.anims.create({
        key: 'left',
        frames: self.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn',
        frames: [{ key: 'ship', frame: 4 }],
        frameRate: 20
    });

    self.anims.create({
        key: 'right',
        frames: self.anims.generateFrameNumbers('ship', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

}
