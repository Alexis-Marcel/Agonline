//import VirtualJoystickPlugin from '/phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { initClient } from "../../scriptGlobal/global.js";
const config = {
    type: Phaser.AUTO,
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH},
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
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
    this.cursors = this.input.keyboard.createCursorKeys();
    addPlayer(self,playerInfo);

    socket.on("taille", (w,h) => {
        this.physics.world.setBounds(0, 0, w, h);
    });
    //socket.on("score", () => getScore());
    socket.on("newRound", () => {

        $("#game").removeClass("d-none");
        $("#waitRound").addClass("d-none");

    });



}

function addPlayer(self,playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x,playerInfo.y).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    self.NewShip = self.physics.add.image(self.canvas.width/2,self.canvas.height/2, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40)
    self.NewShip.setTint(playerInfo.color);
    self.ship.setCollideWorldBounds(true);
    self.ship.setBounce(2);
    self.ship.setDrag(100);
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200);
}

function update() {
    if(gameOver){
        return;
    }
    if (this.ship) {
        if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-150);
            this.NewShip.setAngularVelocity(-150);
        } else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(150);
            this.NewShip.setAngularVelocity(150);
        } else {
            this.ship.setAngularVelocity(0);
            this.NewShip.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
        } else {
            this.ship.setAcceleration(0);
        }

        let x = this.ship.x;
        let y = this.ship.y;
        let r = this.ship.rotation;
        if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {

            socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
        }
    // save old position data
        this.ship.oldPosition = {
            x: this.ship.x,
            y: this.ship.y,
            rotation: this.ship.rotation
        };
    }
}
