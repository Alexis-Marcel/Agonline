const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT,
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

/**
 * récupération des paramètres permettant de créer l'utilisateur
 */
 const nom = localStorage.getItem('name');

 const params = new URLSearchParams(window.location.search)
 const room = params.get('room');
 
 /**
  * connexion de l'utilisateur à la salle
  */
 socket.emit("login", nom, room);
 
 /**
  *initialisation du nombre de joueurs présent dans la salle
  */
 socket.on("userNumber", (number) => {
     $("#userNumberChat").text(number);
 });
 socket.emit("userNumber", room);
 
var playerInfo
 /**
  * connexion  aprouvée
  */
 socket.on("login", () => {
    socket.on("setUp",(info) => {
       playerInfo = info;
       var gamePlayer = new Phaser.Game(config);

    });
 });

function preload() {
    this.load.image('ship', '../../assets/images/enemyBlack5.png')
    this.canvas = this.sys.game.canvas;
}

function create() {
    self = this;
    this.cursors = this.input.keyboard.createCursorKeys();
    addPlayer(self,playerInfo);

}

function addPlayer(self,playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x,playerInfo.y).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    self.NewShip = self.physics.add.image(self.canvas.width/2,self.canvas.height/2, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40)
    self.NewShip.setTint(playerInfo.color);
    self.ship.setDrag(100);
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200);
}

function update() {
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

        //this.physics.world.wrap(this.ship, 5);
        // emit player movement
        let x = this.ship.x;
        let y = this.ship.y;
        let r = this.ship.rotation;
        if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
            console.log("update mouvement")
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
