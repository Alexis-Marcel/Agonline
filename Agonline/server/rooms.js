const { removeUser } = require("./users.js");
const { io } = require("./server.js");
const rooms = [];

function checkValidRoom(roomTry, socket) {

    if (roomTry === "") {
        socket.emit("alert", "Veuillez saisir le code de GameRoom.");
    } else if (!rooms.some((room) => room.codeRoom === roomTry.toUpperCase())) {
        socket.emit("alert", `Le code : ${roomTry} ne correspond à aucune room.`);
    } else {
        return true;
    }
}

function getRoomByCode(code) {
    return rooms.find((room) => room.codeRoom === code.toUpperCase());
}

function getNumberUsersByCode(code) {
    let room = getRoomByCode(code);
    if(room == undefined) return -1
    else return room.users.length;
}

function getRoomByUserId(id) {
    rooms.forEach((room) => {
        if(room.users.find(user => user.socket.id === id) !== undefined)
            return room;
    })
}

function enterInARoom(socket,code,name){

    let room = getRoomByCode(code);
    if(room != undefined) room.addUser(socket,name);
}

function getRoomBySocketCreateur(s) {
    return rooms.find((room) => room.socketCreateur.id === s.id);
}


function removeRoom(room) {

    rooms.splice(rooms.indexOf(room),1);
}

function checkRoomStatus(room,name,socket){
    if(room.start){

        socket.join(this.codeRoom+ "WAIT");
        
        const user = {socket : socket, name : name}
        room.waitingQueue.push(user);
        io.to(this.codeRoom+"WAIT").emit("waitingNumber", room.waitingQueue.length);

        socket.on("disconnect", () => {
            removeUser(room.waitingQueue, socket);
            socket.leave(this.codeRoom+"WAIT");
        });
        let message = "La partie a déjà commencé. Vous avez été placé en file d'attente !";
        socket.emit("waitingQueue", {txt : message, place : (room.waitingQueue.indexOf(user)+1),total : room.waitingQueue.length});
    }
    else {
        return true;
    }
}

module.exports = { rooms,getRoomByUserId, checkValidRoom, getRoomByCode, getRoomBySocketCreateur, getNumberUsersByCode, enterInARoom, removeRoom, checkRoomStatus };