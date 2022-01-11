const socket = io();

import { displayMessage, setSolution } from "./message.js";

let codeRoom = codeAleatoire();
$("#codeRoom").val(codeRoom);

socket.emit("createur", codeRoom);

socket.on("userNumber", (number) => {
    $("#nombreJoueur").val(number);
    $("#userNumberChat").text(number);
});

socket.emit("userNumber", codeRoom);

socket.on("serverMessage", displayMessage);

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
  $("#question").text(set.question);

  for (var i = 0; i < 4; i++) {
    $("#A, #B, #C, #D")[i].innerHTML = $("#A, #B, #C, #D")[i].id + " : " +set.reponse[i];
  }

  solution = set.correct;

  });

  $("#start-button").on("click",start);

  socket.on("last", () => $("#start-button").html("Recommencer le jeu"));

  socket.on("endGame", () => resetDisplay());
});



function start() {

  $("#waitMessage").toggleClass("d-none");
  $("#game").toggleClass("d-none");

  socket.emit("start");

  socket.emit("questionSuivanteRequest");

  setTimer("afficher");

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
  $("#game").toggleClass("d-none");
  $("#start-button").off("click");
  $("#start-button").on("click",start);
  $("#start-button").html("Lancer le jeu");
  socket.emit("restart");
}