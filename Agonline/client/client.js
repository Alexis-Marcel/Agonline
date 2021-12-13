const socket = io();

var nom = localStorage.getItem('name');

socket.emit("loginAttempt", nom);

socket.on("userNumber", (number) => {
    $("#userNumberChat").text(number);
});


socket.on("login", () => {

    $(".msg-inputarea").on("submit", function( event ) {
        event.preventDefault();
        submitMessage();
    });

    $("#logoutButton").on("click",logout);
    socket.on("serverMessage", displayMessage);
    socket.on("removeUser", removeUser);
    socket.on("kick", kick);
});

function kick() {
    setTimeout(() => {
        logout();
    }, 3000);
}


function logout() {
    location.reload();
}

function submitMessage() {
    var text = $("#messageInput").val();
    socket.emit("clientMessage", text);
    $("#messageInput").val("").focus();
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



$('#button-chat').on( "click", function() {
    
    $("#room").toggle("slide");
});

$('#button-chat').on("mouseover",function() {
    $("#img-chat").attr('src', './switch-hover.png');
    $("#switch").toggleClass("switch-hover");
    
});
  
$('#button-chat').on("mouseout",function() {
    $("#img-chat").attr('src', './switch.png');
    $("#switch").toggleClass("switch-hover");
});