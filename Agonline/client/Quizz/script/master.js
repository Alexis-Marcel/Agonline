const socket = io();

import { setSolution} from "./affichage.js";
import { displayMessage} from "../../scriptGlobal/message.js";


const params = new URLSearchParams(window.location.search)
const jeu = params.get('jeu');

let codeRoom = codeAleatoire();
$("#codeRoom").val(codeRoom);

socket.emit("createur", codeRoom, jeu);

socket.on("userNumber", (number) => {
    $("#nombreJoueur").val(number);
    $("#userNumberChat").text(number);
});

socket.emit("userNumber", codeRoom);

socket.on("serverMessage", (score) => displayMessage(score));

$(".msg-inputarea").on("submit", function( event ) {
  event.preventDefault();
  submitMessage();
});

function submitMessage() {
  var text = $("#messageInput").val();
  socket.emit("creatorMessage", codeRoom,text);
  $("#messageInput").val("").focus();
}

let solution;

socket.on("setUp", () => {

  socket.on("timer", (time) => displayTime(time));

  socket.on("questionSuivanteResponse", (set) => {

  setSolution("cacher",solution);
  setTimer("afficher");
  $("#game").removeClass("d-none");
  $("#score").addClass("d-none");

  $("#affichageScore div").remove();

  $("#question").text(set.question);

  for (var i = 0; i < 4; i++) {
    $("#rA, #rB, #rC, #rD")[i].innerHTML = $("#rA, #rB, #rC, #rD")[i].id + " : " +set.reponse[i];
  }

  solution = set.correct;

  });

  $("#start-button").on("click",start);

  socket.on("last", () => $("#start-button").html("Recommencer le jeu"));

  socket.on("endGame", () => resetDisplay());

  socket.on("scoreJoueurs", (score) => displayScore(score));
});



function start() {

  $("#waitMessage").toggleClass("d-none");

  socket.emit("start");


  socket.emit("questionSuivanteRequest");

  $("#start-button").off("click");
  $("#start-button").on("click",() => socket.emit("questionSuivanteRequest"));
  $("#start-button").html("Question suivante");

}

function displayTime(timer){
  let timeleft = timer.temps;
  
      if (timeleft <= 0) {
        setTimer("cacher");
        setSolution("afficher",solution);
      } else {
        $("#timesLeft").text(timeleft + " secondes");
      }
}

function displayScore(score){
  score.sort(function(a,b){
    return b.score - a.score;
  })

  let compte=1;
  score.forEach(joueur => {
    const num = $("<div></div>").text(compte);
    const name = $("<div></div>").text(joueur.name);
    const point = $("<div></div>")
        .text(joueur.score);
    const scoreJoueur = $("<div></div>")
        .append(num)
        .append(name)
        .append(point)
        .addClass("d-flex")
        .addClass("justify-content-between")
        .addClass("align-items-center");
    $("#affichageScore")
        .append(scoreJoueur)
        .scrollTop(function () {
            return this.scrollHeight;
        });

    compte++;
  });

  $("#game").toggleClass("d-none");
  $("#score").removeClass("d-none");
  
}

function setTimer(param){
  if(param === "afficher"){
    $("#timesLeft").parent().removeClass("d-none");
  }
  else {
    $("#timesLeft").parent().addClass("d-none");
    $("#timesLeft").text("");
  }
}


function codeAleatoire() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

function copy() {

    $("#codeRoom").select();
    document.execCommand("copy");
}

$("#copy").on("click", copy);
  

function resetDisplay(){
  setTimer("cacher");
  $("#waitMessage").toggleClass("d-none");
  $("#start-button").off("click");
  $("#start-button").on("click",start);
  $("#start-button").html("Lancer le jeu");
  socket.emit("restart");
}


