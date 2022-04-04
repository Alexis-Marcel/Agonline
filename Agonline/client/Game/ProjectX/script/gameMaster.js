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
var otherPlayers;
var winnerRoundText;
function init() {

    new Phaser.Game(config); // lancement de phaser;
}

function preload() {
    this.load.image('ship', '../../assets/images/spaceShips_001.png');
    this.load.image('otherPlayer', '../../assets/images/enemyBlack5.png');
    this.load.image('asteroide', '../../assets/images/asteroide.png');
}
function release (){
    for (var i = 0; i < apparition; i++)
    {

        var block = group.create(this.sys.game.canvas.width, this.sys.game.canvas.height, 'asteroide').setOrigin(0.5, 0.5).setDisplaySize(43, 30);
        var block2= group.create(0, this.sys.game.canvas.height, 'asteroide').setOrigin(0.5, 0.5).setDisplaySize(43, 30);
        var block3 = group.create(0, 0, 'asteroide').setOrigin(0.5, 0.5).setDisplaySize(43, 30);
        var block4 = group.create(this.sys.game.canvas.width, 0, 'asteroide').setOrigin(0.5, 0.5).setDisplaySize(43, 30);
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
    if(apparition < 5){
        apparition+=1;
    }




}

function create() {
    this.gameWidth = this.sys.game.canvas.width
    this.gameHeight = this.sys.game.canvas.height

    spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -10, -200);
    spriteBounds.y += 100;

    let self = this;

    group = this.physics.add.group();
    group.runChildUpdate = false;
    otherPlayers = this.physics.add.group();

    createWinnerRoundText(this);

    socket.on("userNumber", (number) => {
        $("#nombreJoueur").val(number);
        $("#userNumberChat").text(number);
    });
    this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);


    socket.on("start", () => displayStart());

    socket.on('newPlayer', (playerInfo) => addOtherPlayers(self, playerInfo));

    socket.on("newRound", () =>{
        $("#game").removeClass("d-none");
        $("#score").addClass("d-none");
        socket.emit("taille",(self.gameWidth , self.gameHeight ));
        this.time.addEvent({ delay: 3000, callback: release, callbackScope: this, repeat: 30});




    });
    socket.on("affichageScore", (winnerName) => endRound(winnerName,self));

    socket.on('disconnectJoueur', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    socket.on('playerMoved', function (playerInfo) {
        otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                if(otherPlayer.gameOver){
                    return;
                }
                console.log("update");
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
}





function hitAsteroide(p,a){
    if(p.gameOver){
        return;
    }

    p.gameOver = true;

    p.setTint(0xff0000);

    p.setVelocityX(0);
    socket.emit("gameOver", p.playerId);
}

function addOtherPlayers(self, playerInfo) {

    let otherPlayer = otherPlayers.create(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(43, 30);
    otherPlayer.gameOver = false;
    otherPlayer.tint = playerInfo.color;
    otherPlayer.playerId = playerInfo.playerId;
    self.physics.add.collider(otherPlayer, group, hitAsteroide, null, self);
    otherPlayer.setBounce(0.2);
    otherPlayer.setImmovable();
    otherPlayer.setCollideWorldBounds(true);



}

function displayStart() {
    $("#waitMessage").addClass("d-none");
    $("#numberQuestion").removeClass("d-none");
    $("#start-button").off("click");
    $("#start-button").addClass("d-none");

}

function createWinnerRoundText(self){

    winnerRoundText = self.add.text(10,10,'AAAA',{ font: "bold 60px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
    winnerRoundText.visible = false;

}


function endRound (winnerName,self){
    console.log("test");
    winnerRoundText.setText(winnerName + " a gagné ce round !");
    winnerRoundText.visible = true;
    self.physics.pause();
}

function copy() {

    $("#codeRoom").select();
    document.execCommand("copy");
}

$("#copy").on("click", copy);