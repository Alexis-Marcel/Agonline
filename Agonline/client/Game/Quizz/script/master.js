const socket = io();

import { setSolution } from "./affichage.js";
import { initMaster } from "../../scriptGlobal/global.js";

const params = new URLSearchParams(window.location.search)
const type = params.get('type');


const gameName = "quizzCreation";

const codeRoom = initMaster(socket, init, gameName, type);

function init() {
  /**
  * écoute du timer
  */
  socket.on("timer", (timeleft) => $("#timesLeft").text(timeleft + " secondes"));



  /**
   * afficher une question
   */
  socket.on("affichageQuestion", (set) => displayQuestion(set));

  /**
   * afficher la solution
   */
  socket.on("solution", (solu) => displaySolution(solu));

  /**
   * afficher le score global
   */
  socket.on("affichageScore", (score, end) => displayScore(score, end));

  socket.on("nbReponse", (nbReponse, nbUser) => $("#nbReponse").text(nbReponse + "/" + nbUser));


  socket.on("nbQuestion", (nbQuestion, totalQuestion) => $("#nbQuestion").text(nbQuestion + "/" + totalQuestion));

}

let solution;

function displayQuestion(set) {

  $("#waitMessage").addClass("d-none");
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


function displaySolution(solu) {

  $("#start-button").html("Afficher score");
  $("#start-button").off("click");
  $("#start-button").on("click", () => socket.emit("afficherScore"));
  solution = solu;
  setTimer("cacher");
  setNbReponse("cacher");
  setSolution("afficher", solution);
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
    if (joueur.score <= 1) {
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

function creerQRC() {
  let url = window.location.origin + "/Global/joinGame.html?room=" + codeRoom;
  let qrc = "https://chart.googleapis.com/chart?cht=qr&chl=" + encodeURIComponent(url) + "&chs=200x200&choe=UTF-8&chld=L|0";
  $("#img-qrcode").attr("src", qrc);
  console.log(url);
}





