const { io, botName } = require("../server.js");
const { getRandomColorHexa,getRandomColor, Colors } = require("../color.js");
const { removeUser, getUserById } = require("../users.js");
const { removeRoom } = require("../rooms.js");
const CreatorName = "MASTER";
const baseRedirection = "../Game/";

// constructeur d'une gamePlayer

class Game {
    constructor(socketCreateur) {
        this.codeRoom = codeAleatoire();
        this.socketCreateur = socketCreateur;
        this.users = [];
        this.waitingQueue = [];
        this.colors = Colors;

        this.start = false;

        socketCreateur.join(this.codeRoom);
        socketCreateur.on("creatorMessage", (text) => this.creatorMessage(text));
        socketCreateur.emit("codeRoom", this.codeRoom);
        socketCreateur.on("disconnect", () => this.closeGame());

        console.log(this.codeRoom + " has been created");
    }

    closeGame() {
        this.start = false;
        this.socketCreateur.leave(this.codeRoom);
        io.to(this.codeRoom).emit("getOut", "../../RoomConnexion/joinRoom.html?alert=closed");
        removeRoom(this);
        console.log(this.codeRoom + " has been closed");
        
    }

    startGame() {
        console.log(this.codeRoom + " start")
        this.start = true;
    }

    endGame(){
        console.log(this.codeRoom + " end")
        this.start = false;
        destination = this.destinationClient;
        this.waitingQueue.forEach( user => {
            
            user.socket.emit("checkLog", destination);
        });

    }

    addUser(socket, name) {
        socket.join(this.codeRoom);
        socket.on("clientMessage", (text) => this.sendMessage(socket, text));

        socket.emit("login");
        io.to(this.codeRoom).emit("serverMessage", {
            name: botName,
            text: `${name} est entré dans la salle !`,
            color: "white",
            style: "italic",
        });

        //ajout du joueur dans la liste des joueurs de la partie
        const user = { socket: socket, name: name, color: getRandomColor(this.colors) };
        console.log(this.colors.length);
        this.users.push(user);
        let nbJoueur = this.users.length;
        io.to(this.codeRoom).emit("userNumber", nbJoueur);

        socket.on("disconnect", () => this.removeSocket(socket));

        console.log(name + ' has join ' + this.codeRoom);

        return user;
    }

    removeSocket(socket) {

        const user = getUserById(this.users, socket.id);
        io.to(this.codeRoom).emit("serverMessage", {
            name: botName,
            text: `${user.name} a quitté la salle !`,
            color: "white",
            style: "italic",
        });
        socket.leave(this.codeRoom);
        removeUser(this.users, user);
        let nbJoueur = this.users.length;
        io.to(this.codeRoom).emit("userNumber", nbJoueur);

        console.log(user.name + ' has left ' + this.codeRoom);

        return user;
    }


    sendMessage(socket, text) {
        console.log("message");
        if (text.length === 0) return;
        if (text.length > 280) {
            socket.emit("serverMessage", {
                name: botName,
                text: `You have to restrict your message to 280 characters!`,
                color: "white",
                style: "italic",
                weight: "normal",

            });
            return;
        }
        const user = getUserById(this.users, socket.id);
        if (!user) {
            console.log("erreur no name");
            return;
        }

        io.to(this.codeRoom).emit("serverMessage", {
            name: user.name,
            text: text,
            color: "#"+user.color,
            style: "normal",
            weight: "normal",

        });
    }

    /**
     * envoie d'un message du createur
     */
    creatorMessage(text) {

        io.to(this.codeRoom).emit("serverMessage", {
            name: CreatorName,
            text: text,
            color: "red",
            style: "normal",
            weight: "bold",
        });
    }
};

function codeAleatoire() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = { Game, baseRedirection };