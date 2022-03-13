var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var player;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{

    
    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

     //  The score
     scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFF' });

     socket.on("majScore", (score) => {
                //  Add and update the score
        score += 10;
        scoreText.setText('Score: ' + score);
     });

     socket.on("majGameOver", () => gameOver = true);

}

function update ()
{
    var movementX = null;
    var movementY= null;
    
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        movementX = "left";

    }
    else if (cursors.right.isDown)
    {
        movementX = "right";

    }
    else
    {
        movementX = "turn";

    }

    if (cursors.up.isDown)
    {
        movementY = "up";
    }

    console.log("update mouvement")
    socket.emit('playerMovement', { x: movementX, y: movementY});
    

}

