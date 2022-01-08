const users = [];

function removeUser(user) {
    const i = users.indexOf(user);
    users.splice(i, 1);
}

function getUserById(id) {
    return users.find((user) => user.id === id);
}

function getUserByName(name) {
    return users.find((user) => user.name === name);
}

function getUserByRoom(room) {
    return users.find((user) => user.room === room);
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

module.exports = { users, removeUser, getUserById, getUserByName, getUserByRoom, getNumberedUsersByRoom};
