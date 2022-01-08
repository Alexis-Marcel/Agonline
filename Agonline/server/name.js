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


module.exports = { checkValidName };