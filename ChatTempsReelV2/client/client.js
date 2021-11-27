const socket = io();

socket.on("userNumber", (number) => {
    $("#userNumberSpan").text(number);
});

$("#loginButton").click(loginAttempt);
$("#nameInput")
    .focus()
    .keydown((e) => {
        if (e.key === "Enter") loginAttempt();
    });

function loginAttempt() {
    const name = $("#nameInput").val();
    socket.emit("loginAttempt", name);
}

socket.on("alert", (txt) => {
    $("#loginAlert").text(txt).addClass("alert");
    setTimeout(() => {
        $("#loginAlert").removeClass("alert");
    }, 1500);
});

socket.on("login", () => {
    $("#loginForm").hide();
    $("#room").show();
    $("#messageSubmit").click(submitMessage);
    $("#messageInput")
        .focus()
        .keydown((e) => {
            if (e.key === "Enter") submitMessage();
        });
    $("#topicInput").keyup(changeTopic);
    $("#logoutButton").show().click(logout);
    socket.on("serverMessage", displayMessage);
    socket.on("user", showUser);
    socket.on("removeUser", removeUser);
    socket.on("topic", setTopic);
    socket.on("kick", kick);
});

function kick() {
    setTimeout(() => {
        logout();
    }, 3000);
}

let emittingTopic = false;

function changeTopic() {
    if (emittingTopic) return;
    emittingTopic = true;
    setTimeout(() => {
        socket.emit("topic", $("#topicInput").val());
        emittingTopic = false;
    }, 500);
}

function setTopic(topic) {
    $("#topicInput").val(topic);
}

function logout() {
    location.reload();
}

function submitMessage() {
    var text = $("#messageInput").val();
    socket.emit("clientMessage", text);
    $("#messageInput").val("").focus();
}

function showUser(user) {
    const userSpan = $("<span></span>")
        .text(user.name)
        .css("color", user.color)
        .addClass("userSpan")
        .attr("title", `Send private message to ${user.name}`)
        .attr("name", user.name)
        .click(() => {
            $("#messageInput")
                .val($("#messageInput").val() + ` [@${user.name}] `)
                .focus();
        });
    $("#userList").append(userSpan);
}

function removeUser(user) {
    $(`[name= ${user.name}]`).remove();
}

function getTime() {
    const currentDate = new Date();
    const timeOption = { hour: "2-digit", minute: "2-digit" };
    return currentDate.toLocaleTimeString([], timeOption);
}

const messages = document.getElementById("messages");

function displayMessage(serverMessage) {
    const timeStamp = $("<span></span>").text(getTime()).addClass("timeStamp");
    const userInfo = $("<span></span>")
        .text(`${serverMessage.name}: `)
        .css("color", serverMessage.color);
    const messageText = $("<span></span>")
        .text(serverMessage.text)
        .css("color", serverMessage.color)
        .css("font-style", serverMessage.style);
    const message = $("<div></div>")
        .addClass("message")
        .append(timeStamp)
        .append(userInfo)
        .append(messageText);
    $("#messages")
        .append(message)
        .scrollTop(function () {
            return this.scrollHeight;
        });
}
