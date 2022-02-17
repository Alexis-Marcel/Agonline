const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
app.use(express.static('/client/assets/images'));
app.use(express.static("client")); 

const socket = require("socket.io");
const io = socket(server);
const botName = "ChatBot";

module.exports = { io, botName };

const { checkValidName} = require("./users.js");
const { rooms, checkValidRoom, getRoomByCode } = require("./rooms.js");
const { Quizz } = require("./game/quizz.js");
const {projectx} = require("./game/projectx");
require("./spam.js");



io.on("connection", (socket) => {

    /**
     * envoie du nombre de participant dans la room
     */
    socket.on("userNumber", (room) => socket.emit("userNumber", getRoomByCode(room).users.length));

    /**
     * création d'un quizz
     */
    socket.on("quizzCreation", (jeu) => {
        rooms.push(new Quizz(socket,jeu));
    });
    /**
     * Création d'un jeu projectX
     */
    socket.on("creationProjectX", () => {
        rooms.push(new projectx(socket));
    });
    /**
     * connexion du joueur sur la page gameRoom.html
     */
    socket.on("login", (name, room) => getRoomByCode(room).addUser(socket,name));

    /**
     * initialisation du nom du joueur dans la page joinGame.html
     */
    socket.on("checkLog", (name,room) => {
        let roomCurrent = getRoomByCode(room)
        if (checkValidName(name, socket, roomCurrent.users)) {
            destination = roomCurrent.destinationClient;
            socket.emit("checkLog", destination);
        }
    });

    /**
     * initialisation de la partie que le joueur veut rejoindre dans la page joinRoom.html
     */
    socket.on("checkRoom", (room) => {
        if (checkValidRoom(room, socket)) {
            destination = "joinGame.html?room=" + room;
            socket.emit("checkRoom", destination);       
        }
    });

});

