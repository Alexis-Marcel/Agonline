
function checkValidName(name, socket, users,start) {
    
    if (name === "") {
        socket.emit("alert", "Choissisez un nom pour pouvoir jouer.");
    } else if (name.length > 20) {
        socket.emit("alert", "Votre nom est trop long.");
    } else if (!name.match(/^[A-Za-z0-9_-]+$/g)) {
        socket.emit("alert", "Seul les lettres, nombres et caractères _ - sont autorisés.");
    } else if (users.some((user) => user.name === name)) {
        socket.emit("alert", `Le nom ${name} est déjà utilisé.`);
    } else if(start){
        socket.emit("alert", `La partie a déjà commencé.`);
    }else{ 
        return true;
    }
}

function removeUser(users,user) {

    users.splice(users.indexOf(user),1);
}

function getUserById(users,id) {
        return users.find((user) => user.socket.id === id);
}



module.exports = { checkValidName, removeUser, getUserById};
