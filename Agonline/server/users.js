const users = [];

function checkValidName(name,room, socket, users) {
    
    if (name === "") {
        socket.emit("alert", "Choissisez un nom pour pouvoir jouer.");
    } else if (name.length > 20) {
        socket.emit("alert", "Votre nom est trop long.");
    } else if (!name.match(/^[A-Za-z0-9_-]+$/g)) {
        socket.emit("alert", "Seul les lettres, nombres et caractères _ - sont autorisés.");
    } else if (users.some((user) => user.name === name && user.room === room)) {
        socket.emit("alert", `Le nom ${name} est déjà utilisé.`);
    } else {
        return true;
    }
}

function removeUser(user) {
    const i = users.indexOf(user);
    users.splice(i, 1);
}

function getUserById(id) {
    return users.find((user) => user.socket.id === id);
}

function getUserByName(name) {
    return users.find((user) => user.name === name);
}

function getUsersByRoom(room) {
    var liste = [];
    users.forEach((user) =>{
        if(user.room === room){
            liste.push(user);
        }
    });
    return liste;
}


function getNumberedUsersByRoom(room) {

    var nbUsers = 0;
    for (const user of users) {
        if(user.room === room){
            nbUsers++;
        }
    }
    return nbUsers;
}

module.exports = { users, checkValidName, removeUser, getUserById, getUserByName, getUsersByRoom, getNumberedUsersByRoom};
