import { initMaster } from "../../scriptGlobal/global.js";

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    scale: { mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: 1000,
            height: 600
        }},
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
    }
};
const gameName = "creationProjectX";
const socket = io();
const codeRoom = initMaster(socket, init, gameName);
var spriteBounds;
var group;
var text;
var apparition = 1;

function init() {

    new Phaser.Game(config); // lancement de phaser;
}

function preload() {
    this.load.image('ship', '../../assets/images/spaceShips_001.png');
    this.load.image('otherPlayer', '../../assets/images/enemyBlack5.png');
    //this.load.image('asteroide', '../../assets/images/asteroide.png');
}

function release (){
    for (var i = 0; i < apparition; i++)
    {

        var block = group.create(this.sys.game.canvas.width, this.sys.game.canvas.height, 'ship');
        var block2= group.create(0, this.sys.game.canvas.height, 'ship');
        var block3 = group.create(0, 0, 'ship');
        var block4 = group.create(this.sys.game.canvas.width, 0, 'ship');
        block.setVelocity(Phaser.Math.Between(-200, 0), Phaser.Math.Between(-200, 0));
        block.setMaxVelocity(300);
        block.setBlendMode(1);
        block2.setVelocity(Phaser.Math.Between(0, 200), Phaser.Math.Between(-200, 0));
        block2.setMaxVelocity(300);
        block2.setBlendMode(1);
        block3.setVelocity(Phaser.Math.Between(0, 200), Phaser.Math.Between(0, 200));
        block3.setMaxVelocity(300);
        block3.setBlendMode(1);
        block4.setVelocity(Phaser.Math.Between(0, -200), Phaser.Math.Between(0, 200));
        block4.setMaxVelocity(300);
        block4.setBlendMode(1);
    }
    apparition+=1;

    text.setText('Total: ' + group.getLength());
}

function create() {
    this.gameWidth = this.sys.game.canvas.width
    this.gameHeight = this.sys.game.canvas.height

    spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -10, -200);
    spriteBounds.y += 100;

    let self = this;

    group = this.physics.add.group();
    group.runChildUpdate = false;

    this.time.addEvent({ delay: 3000, callback: release, callbackScope: this, repeat: 30});
    text = this.add.text(10, 10, 'Total: 0', { font: '16px Courier', fill: '#ffffff' });

    socket.on("userNumber", (number) => {
        $("#nombreJoueur").val(number);
        $("#userNumberChat").text(number);
    });

    this.otherPlayers = this.physics.add.group();

    socket.on("start", () => displayStart());

    socket.on("nbRound", (nbRound) => $("#nbRound").text(nbRound));

    socket.on('newPlayer', (playerInfo) => addOtherPlayers(self, playerInfo));

    socket.on("newRound", () => startRoundSetUp(self));

    socket.on("endGame", () =>{
        $("#start-button").on("click", function () {
            socket.emit("start");
        });
        $("#start-button").removeClass("d-none");

        if( $("#score").hasClass("d-none")){

            console.log("stop urgent");
            this.physics.pause();
            surviveTimer.paused = true;

            $("#waitMessage").removeClass("d-none");
            $("#game").addClass("d-none");

        }
    });

    //afficher le score global
    socket.on("affichageScore", (score,winnerName) => endRound(score,winnerName,self));

    socket.on('disconnectJoueur', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
}

function startRoundSetUp(self){


    $("#game").removeClass("d-none");
    $("#score").addClass("d-none");

}




function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    otherPlayer.tint = playerInfo.color;
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);

}

function displayStart() {
    $("#waitMessage").addClass("d-none");
    $("#numberQuestion").removeClass("d-none");
    $("#start-button").off("click");
    $("#start-button").addClass("d-none");
    socket.emit("taille",(this.gameWidth , this.gameHeight ));
}


function copy() {

    $("#codeRoom").select();
    document.execCommand("copy");
}

$("#copy").on("click", copy);