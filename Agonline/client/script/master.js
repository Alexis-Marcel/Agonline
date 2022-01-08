const socket = io();

import { displayMessage } from "./message.js";

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


$("#start-button").on("click", function (event){
  socket.emit("start", codeRoom)
});

let solution;
socket.on("set", (set) => {
  $("#question").text(set.question);

  for (var i = 0; i < 4; i++) {
    $("#A, #B, #C, #D")[i].innerHTML = set.reponse[i];
  }

  solution = set.correct;

});

function afficherSolution(){

  let sol = "#"+solution;
  $("#A, #B, #C, #D").parent().parent().toggleClass("bg-light");
  $("#A, #B, #C, #D").parent().parent().toggleClass("text-white");
  $("#A, #B, #C, #D").parent().parent().toggleClass("text-dark");
  $("#A, #B, #C, #D").parent().parent().toggleClass("bg-danger");
  $(sol).parent().parent().toggleClass("bg-danger");
  $(sol).parent().parent().toggleClass("bg-success");



}

socket.on("timer", (time) => displayTime(time));


function displayTime(timer){
  let timeleft = timer.temps;
      if (timeleft <= 0) {
        $("#timesLeft").text("Finished");
        afficherSolution();
      } else {
        $("#timesLeft").text(timeleft + " secondes");
      }
}


function codeAleatoire() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  