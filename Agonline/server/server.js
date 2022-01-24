const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

app.use(express.static("client")); 

const socket = require("socket.io");
const io = socket(server);
const botName = "ChatBot";

module.exports = { io, botName };

const { users,checkValidName, removeUser, getUserById, getUserByName, getUserByRoom, getNumberedUsersByRoom } = require("./users.js");
const { getRandomColor } = require("./color.js");
const { rooms, checkValidRoom, getRoomByCode, getRoomBySocketCreateur } = require("./rooms.js");
const { sendMessage, creatorMessage } = require("./Jeu/Chat.js");
const { setUpQuizz, setUpQuizzClient} = require("./Jeu/Quizz.js");

require("./spam.js");


io.on("connection", (socket) => {

    /**
     * envoie du nombre de participant dans la room
     */
    socket.on("userNumber", (room) => socket.emit("userNumber", getNumberedUsersByRoom(room)));

    /**
     * création d'une partie
     */
    socket.on("createur", (room,jeu) => createRoom(socket,room,jeu));   
    
    /**
     * connexion du joueur sur la page gameRoom.html
     */
    socket.on("login", (name, room) => addUser(socket, name, room));

    /**
     * initialisation du nom du joueur dans la page joinGame.html
     */
    socket.on("checkLog", (name,room) => {
        if (checkValidName(name,room, socket, users)) {
            destination = "../Quizz/quizzPlayer.html?room=" + room;
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



/**
 * creation d'un jeu
 */
function createRoom(socket, codeRoom,j) {
    socket.join(codeRoom);
    
    let jeu;
    if(j == "quizz"){
        jeu = setUpQuizz(socket,codeRoom);
    }
    const room = { codeRoom: codeRoom, socketCreateur : socket, game: jeu};
    rooms.push(room);

    console.log("création d'un jeu"+ codeRoom);
   
}

/**
 * ajout d'un joueur à un jeu
 */
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
    const user = { socket: socket, name: name, room: room, color: getRandomColor() };
    users.push(user);
    io.to(room).emit("userNumber", getNumberedUsersByRoom(room));

    if(getRoomByCode(room).game.name == "quizz"){
        setUpQuizzClient(socket);
    }
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


