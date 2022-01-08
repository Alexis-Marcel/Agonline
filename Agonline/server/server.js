const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

app.use(express.static("client")); 

const socket = require("socket.io");
const io = socket(server);
const botName = "ChatBot";
const CreatorName = "MASTER";

module.exports = { io, botName };

const { users, removeUser, getUserById, getUserByName, getUserByRoom, getNumberedUsersByRoom } = require("./users.js");
const { checkValidName } = require("./name.js");
const { getRandomColor } = require("./color.js");
const { rooms, checkValidRoom } = require("./rooms.js");
require("./spam.js");

io.on("connection", (socket) => {

    /**
     * envoie du nombre de participant dans la room
     */
    socket.on("userNumber", (room) => socket.emit("userNumber", getNumberedUsersByRoom(room)));

    /**
     * création d'une partie
     */
    socket.on("createur", (room) => createRoom(socket,room));   
    
    /**
     * connexion du joueur sur la page gameRoom.html
     */
    socket.on("login", (name, room) => addUser(socket, name, room));

    /**
     * initialisation du nom du joueur dans la page joinGame.html
     */
    socket.on("checkLog", (name,room) => {
        if (checkValidName(name,room, socket, users)) {
            destination = "gameRoom.html?room=" + room;
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

    socket.on("creatorMessage", (room,text) => creatorMessage(room, text));
    socket.on("clientMessage", (text) => sendMessage(socket, text));
    socket.on("disconnect", () => removeSocket(socket));
});


function createRoom(socket, codeRoom) {
    socket.join(codeRoom);
    // ajout du code de la partie dans la liste des parties
    const room = { codeRoom: codeRoom };
    rooms.push(room);

    socket.on("start", (room) => {
        startTimer(room);
        const set = {question: "Quelle est la capital de l'ouzbekistan ?", reponse: ["Paris", "Moscou", "Gontran", "Tachkent"], correct: "D"};
        socket.emit("set",set);
        io.to(room).emit("reponse",set.correct);
    });   
}

function addUser(socket, name, room) {
    socket.join(room);
    socket.emit("login");
    io.to(room).emit("serverMessage", {
        name: botName,
        text: `${name} est entré dans la salle !`,
        color: "white",
        style: "italic",
    });
    //ajout du joueur dans la liste des joueurs de la partie
    const user = { id: socket.id, name: name, room: room, color: getRandomColor() };
    users.push(user);
    io.to(room).emit("userNumber", getNumberedUsersByRoom(room));
}

/**
 * suppresion du joueur dans la liste des joueurs de la partie
 */
function removeSocket(socket) {
    const user = getUserById(socket.id);
    if (!user) return;
    io.to(user.room).emit("serverMessage", {
        name: botName,
        text: `${user.name} a quitté la salle !`,
        color: "white",
        style: "italic",
    });
    socket.leave(user.room);
    removeUser(user);
    io.to(user.room).emit("userNumber", getNumberedUsersByRoom(user.room));
}

/**
 * envoie d'un message d'un joueur
 */
function sendMessage(socket, text) {
    if (text.length === 0) return;
    if (text.length > 280) {
        socket.emit("serverMessage", {
            name: botName,
            text: `You have to restrict your message to 280 characters!`,
            color: "white",
            style: "italic",
            weight : "normal",

        });
        return;
    }
    const user = getUserById(socket.id);
    if (!user){
        console.log("erreur no name");
        return;
    } 

        io.to(user.room).emit("serverMessage", {
            name: user.name,
            text: text,
            color: user.color,
            style: "normal",
            weight : "normal",

        });
}

/**
 * envoie d'un message du createur
 */
function creatorMessage(room,text){

    io.to(room).emit("serverMessage", {
        name: CreatorName,
        text: text,
        color: "red",
        style: "normal",
        weight : "bold",
    });
}

function startTimer(room){
    let timeleft = 10;
    const downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            io.to(room).emit("timer", {
                temps:timeleft,
            })
        } else {
            io.to(room).emit("timer", {
                temps:timeleft,
            })
        }
        timeleft -= 1;
    }, 1000);
}
