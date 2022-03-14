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

module.exports = { rooms,getRoomByUserId, checkValidRoom, getRoomByCode, getRoomBySocketCreateur, getNumberUsersByCode, enterInARoom, removeRoom };