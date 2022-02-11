const socket = io();

import { setSolution } from "./affichage.js";
import { displayMessage } from "../../scriptGlobal/message.js";


let codeRoom;

/**
 * obtention du code de la salle après création de la salle dans le serveur
 */
socket.on("codeRoom", (code) => {
  codeRoom = code;
  $("#codeRoom").val(codeRoom);
  socket.emit("userNumber", codeRoom);
});

/**
 * création d'un quizz
 */
socket.emit("quizzCreation");


/**
 * mise à jour du nombre de joueurs connectés à la salle
 */
socket.on("userNumber", (number) => {
  $("#nombreJoueur").val(number);
  $("#userNumberChat").text(number);
});



socket.on("serverMessage", (text) => displayMessage(text));

/**
 * envoie d'un message dans le chat
 */
$(".msg-inputarea").on("submit", function (event) {
  event.preventDefault();
  var text = $("#messageInput").val();
  socket.emit("creatorMessage", text);
  $("#messageInput").val("").focus();
});


/**
 * écoute du timer
 */
socket.on("timer", (timeleft) => $("#timesLeft").text(timeleft + " secondes"));


/**
 * initialisation du bouton pour lancer le jeu
 */
$("#start-button").on("click", function () {
  $("#waitMessage").toggleClass("d-none");
  socket.emit("start");
});

/**
 * afficher une question
 */
 socket.on("affichageQuestion", (set) => displayQuestion(set));

/**
 * afficher la solution
 */
 let solution;
 socket.on("solution", (solu) => displaySolution(solu));

/**
 * afficher le score global
 */
socket.on("affichageScore", (score,end) => displayScore(score,end));

socket.on("nbReponse",(nbReponse,nbUser) => $("#nbReponse").text(nbReponse + "/"+ nbUser));


socket.on("nbQuestion",(nbQuestion,totalQuestion) => $("#nbQuestion").text(nbQuestion+"/"+totalQuestion));


function displaySolution(solu) {

  $("#start-button").html("Afficher score");
  $("#start-button").off("click");
  $("#start-button").on("click", () => socket.emit("afficherScore"));
  solution = solu;
  setTimer("cacher");
  setNbReponse("cacher");
  setSolution("afficher", solution);
}

function displayQuestion(set) {
  
  $("#nbQuestion").parent().removeClass("d-none");
  $("#start-button").html("Afficher solution");
  $("#start-button").off("click");
  $("#start-button").on("click", () => socket.emit("afficherSolution"));

  setSolution("cacher", solution);
  setTimer("afficher");
  setNbReponse("afficher");
  $("#game").removeClass("d-none");
  $("#score").addClass("d-none");

  $("#affichageScore div").remove();

  $("#question").text(set.question);

  for (var i = 0; i < 4; i++) {
    $("#rA, #rB, #rC, #rD")[i].innerHTML = $("#A, #B, #C, #D")[i].id + " : " + set.reponse[i];
  }

}


function displayScore(score, end) {

  if (end) {// si c'est la fin du jeu
    $("#start-button").html("Recommencer le jeu")
    $("#start-button").off("click");
    $("#start-button").on("click", function () { socket.emit("start") });
  }
  else {
    $("#start-button").html("Question suivante");
    $("#start-button").off("click");
    $("#start-button").on("click", () => socket.emit("afficherQuestion"));

  }


  /**
   * trie du score selon le score décroissant
   */
  score.sort(function (a, b) {
    return b.score - a.score;
  })

  let compte = 1;
  score.forEach(joueur => {
    const num = $("<div></div>").text(compte);
    const name = $("<div></div>").text(joueur.name);
    let point;
    if(joueur.score <=1){
      point = $("<div></div>")
      .text(joueur.score + " point");
    }
    else {
      point = $("<div></div>")
      .text(joueur.score + " points");
    }
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

  $("#game").addClass("d-none");
  $("#score").removeClass("d-none");

}

/**
 * afficher ou cacher le timer
 */
function setTimer(param) {
  if (param === "afficher") {
    $("#timesLeft").parent().removeClass("d-none");
  }
  else {
    $("#timesLeft").parent().addClass("d-none");
  }
}

/**
 * afficher ou cacher le nombre de réponse
 */
 function setNbReponse(param) {
  if (param === "afficher") {
    $("#nbReponse").parent().removeClass("d-none");
  }
  else {
    $("#nbReponse").parent().addClass("d-none");
  }
}

/**
 * copie du code la room
 */
function copy() {

  $("#codeRoom").select();
  document.execCommand("copy");
}

$("#copy").on("click", copy);



