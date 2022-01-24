const socket = io();
import { setSolution} from "./affichage.js";
import { displayMessage} from "../../scriptGlobal/message.js";

var nom = localStorage.getItem('name');

const params = new URLSearchParams(window.location.search)
const room = params.get('room');

socket.emit("login", nom,room);

socket.on("userNumber", (number) => {
    $("#userNumberChat").text(number);
});

socket.emit("userNumber", room);

socket.on("login", () => {

    setUp();

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


let solution;
let reponse;
function setUp(){
    
    console.log("setup");

    socket.on("timer", (time) => {
        let timeleft = time.temps;
          if (timeleft <= 0) {
            setSolution("afficher",solution);
            $("#A, #B, #C, #D").off("click");
          }
    });

    socket.on("reponseClient", (rep) => {

        $("#reponse").removeClass("d-none");
        setSolution("cacher",solution);
        $("#waitQuestion").addClass("d-none");
        setUpReponseClient();
        solution = rep;
    });

    socket.on("restart", () => restart());

    socket.on("score", (score) => {
        $("#reponse").addClass("d-none");
        $("#waitQuestion").removeClass("d-none");
        $("#score").text(score);
    });

   
};

socket.on("start", () => startDisplay());

var lastevent;
function setUpReponseClient(){

    if(lastevent !== undefined){
        let lastRep = "#" + lastevent.id;
        $(lastRep).removeClass("select");
        lastevent = undefined;
    }
    reponse = undefined;

    $("#A, #B, #C, #D").on("click", function (event){

        if(lastevent !== undefined){
            lastevent.classList.toggle("select");
        }
            socket.emit("reponse",event.currentTarget.id); 
            event.currentTarget.classList.toggle("select");
            lastevent = event.currentTarget;
        
    });
}


function startDisplay(){
    $("#waitMessage").toggleClass("d-none");
    $("#reponse").toggleClass("d-none");
}

function restart(){
    $("#waitMessage").toggleClass("d-none");
    $("#reponse").toggleClass("d-none");   

}





