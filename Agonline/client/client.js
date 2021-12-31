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
    socket.on("bonneRep",displayRep)
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

function displayRep(bonneRep){
    if(bonneRep.reponse === reponse){
        document.getElementById("r").innerText = "BRAVO VOUS AVEZ LA BONNE REPONSE" + bonneRep.reponse;
    }
    document.getElementById("r").innerText = "FAUX La bonne réponse était la réponse :"+ bonneRep.reponse;
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


var reponse;

    const e1 = document.getElementById("repA");
    const e2 = document.getElementById("repB");
    const e3 = document.getElementById("repC");
    const e4 = document.getElementById("repD");

    e1.addEventListener("click", () => changerStyle("repA"));
    e2.addEventListener("click", () => changerStyle("repB"));
    e3.addEventListener("click", () => changerStyle("repC"));
    e4.addEventListener("click", () => changerStyle("repD"));

let timeleft = 10;
const downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
        clearInterval(downloadTimer);
        document.getElementById("temps").innerHTML = "Finished";
        window.addEventListener("click", function (event) {
            event.stopImmediatePropagation();
        }, true);
        socket.emit("rep", reponse);
    } else {
        document.getElementById("temps").innerHTML = timeleft + " seconds remaining";
    }
    timeleft -= 1;
}, 1000);

function changerStyle(rep){
    document.getElementById("repA").style.borderColor = "#333";
    document.getElementById("repB").style.borderColor = "#333";
    document.getElementById("repC").style.borderColor = "#333";
    document.getElementById("repD").style.borderColor = "#333";
    document.getElementById(rep).style.borderColor = "red";
    reponse = rep;
}
