const socket = io();
import { displayMessage} from "./message.js";

var nom = localStorage.getItem('name');

const params = new URLSearchParams(window.location.search)
const room = params.get('room');

socket.emit("login", nom,room);

socket.on("userNumber", (number) => {
    $("#userNumberChat").text(number);
});

socket.emit("userNumber", room);

socket.on("login", () => {

    $(".msg-inputarea").on("submit", function( event ) {
        event.preventDefault();
        submitMessage();
    });

    $("#exit").on("click",logout);
    socket.on("serverMessage", displayMessage);
    socket.on("kick", kick);
});

function kick() {
    setTimeout(() => {
        logout();
    }, 3000);
}


function logout() {
    window.location.href = "index.html";
}

function submitMessage() {
    var text = $("#messageInput").val();
    socket.emit("clientMessage", text);
    $("#messageInput").val("").focus();
}

var lastevent;
$("#A, #B, #C, #D").on("click", function (event){

    if(lastevent !== undefined){
        lastevent.classList.toggle("select");
    }

        event.currentTarget.classList.toggle("select");
        lastevent = event.currentTarget;
    
});

let solution;
socket.on("reponse", (rep) =>{
    solution = "#"+rep;
});

socket.on("timer", (time) => {
    let timeleft = time.temps;
      if (timeleft <= 0) {
        afficherSolution();
        setScore();
      }
});

function setScore(){
    if($(solution).hasClass("select")){
        $("#score").text(parseInt($("#score").text())+1);
    }
}
function afficherSolution(){

    $("#A, #B, #C, #D").toggleClass("bg-light");
    $("#A, #B, #C, #D").toggleClass("text-white");
    $("#A, #B, #C, #D").toggleClass("text-dark");
    $("#A, #B, #C, #D").toggleClass("bg-danger");
    $(solution).toggleClass("bg-danger");
    $(solution).toggleClass("bg-success");
  
  
  
  }
  





