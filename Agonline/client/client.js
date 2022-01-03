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
    socket.on("bonneRep",displayRep);
    socket.on("timer",displayTime);
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
        score++;
        document.getElementById("r").innerText = "BRAVO vous avez la bonne réponse score: " + score;
    }else{
        document.getElementById("r").innerText = "FAUX La bonne réponse était la réponse :"+ bonneRep.reponse +" score : "+ score;
    }
}

function displayTime(timer){
    let timeleft = timer.temps;
        if (timeleft <= 0) {
            document.getElementById("temps").innerHTML = "Finished";
            socket.emit("rep", reponse);
            controller.abort();
        } else {
            document.getElementById("temps").innerHTML = timeleft + " seconds remaining";
        }
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
var score = 0;
const controller = new AbortController();
const e1 = document.getElementById("A");
const e2 = document.getElementById("B");
const e3 = document.getElementById("C");
const e4 = document.getElementById("D");

e1.addEventListener("click", () => changerStyle("A"),{signal: controller.signal});
e2.addEventListener("click", () => changerStyle("B"),{signal: controller.signal});
e3.addEventListener("click", () => changerStyle("C",),{signal: controller.signal});
e4.addEventListener("click", () => changerStyle("D"),{signal: controller.signal});



function changerStyle(rep){
    document.getElementById("A").style.borderColor = "#333";
    document.getElementById("B").style.borderColor = "#333";
    document.getElementById("C").style.borderColor = "#333";
    document.getElementById("D").style.borderColor = "#333";
    document.getElementById(rep).style.borderColor = "red";
    reponse = rep;
}
