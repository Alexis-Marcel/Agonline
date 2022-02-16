
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
var game = new Phaser.Game(config);
function preload() {
    this.load.image('ship', '../../assets/images/spaceShips_001.png');
    this.load.image('otherPlayer', '../../assets/images/enemyBlack5.png');
}

function create() {
    let self = this;
    this.socket = io();
    let codeRoom;

    this.socket.on("codeRoom", (code) => {
        codeRoom = code;
        $("#codeRoom").val(codeRoom);
        this.socket.emit("userNumber", codeRoom);
    });

    this.socket.on("userNumber", (number) => {
        $("#nombreJoueur").val(number);
        $("#userNumberChat").text(number);
    });

    this.socket.emit("creationProjectX");

    this.otherPlayers = this.physics.add.group();

    /* useless
    this.socket.on('currentPlayers', function () {
        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
        console.log("ça marche");
    });
    */

    this.socket.on('newPlayer',  (playerInfo) => addOtherPlayers(self, playerInfo));

    this.socket.on('disconnectJoueur', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    this.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    otherPlayer.tint = playerInfo.color;
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

function copy() {

    $("#codeRoom").select();
    document.execCommand("copy");
}

$("#copy").on("click", copy);