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
    return rooms.find((room) => room.codeRoom === code);
}

function getRoomBySocketCreateur(s) {
    return rooms.find((room) => room.socketCreateur.id === s.id);
}

module.exports = { rooms, checkValidRoom, getRoomByCode, getRoomBySocketCreateur };