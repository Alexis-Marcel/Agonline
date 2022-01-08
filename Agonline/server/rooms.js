const rooms = [];

function checkValidRoom(roomTry, socket) {

    if (roomTry === "") {
        socket.emit("alert", "Veuillez saisir le code de GameRoom.");
    } else if (!rooms.some((room) => room.codeRoom === roomTry)) {
        socket.emit("alert", `Le code : ${roomTry} ne correspond à aucune room.`);
    } else {
        return true;
    }
}

module.exports = { rooms, checkValidRoom };