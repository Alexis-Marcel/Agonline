const socket = io();
import { setSolution } from "./affichage.js";
import { displayMessage } from "../../scriptGlobal/message.js";

/**
 * récupération des paramètres permettant de créer l'utilisateur
 */
const nom = localStorage.getItem('name');

const params = new URLSearchParams(window.location.search)
const room = params.get('room');

/**
 * connexion de l'utilisateur à la salle
 */
socket.emit("login", nom, room);

/**
 *initialisation du nombre de joueurs présent dans la salle
 */
socket.on("userNumber", (number) => {
    $("#userNumberChat").text(number);
});
socket.emit("userNumber", room);


let solution;
/**
 * connexion  aprouvée
 */
socket.on("login", () => {

    /**
     * affichage question
     */
    socket.on("question", () => getQuestion());

    /**
     * affichage solution
     */
    socket.on("solution", (solu) => getSolution(solu));

    /**
     * affichage score
     */
    socket.on("score", (end) => getScore(end));

    /**
     * mise à jour du score
     */
    socket.on("majScore", (score) => $("#score").text(score));

    socket.on("getOut",(destination) => window.location.href = destination);


    /**
     * envoie de message dans le chate
     */
    $(".msg-inputarea").on("submit", function (event) {
        event.preventDefault();
        var text = $("#messageInput").val();
        socket.emit("clientMessage", text);
        $("#messageInput").val("").focus();
    });

    /**
     * initialisation du bouton de déconnexion
     */
    $("#exit").on("click", logout);

    socket.on("serverMessage", displayMessage);

    /**
     * commencement du jeu
     */
    socket.on("start", () => startDisplay());
});

function getQuestion() {


    $("#reponse").removeClass("d-none");
    setSolution("cacher", solution);
    $("#waitQuestion").addClass("d-none");
    $("#A, #B, #C, #D").on("click", function (event) {

        socket.emit("score", event.currentTarget.id);
        $("#waitSolution").removeClass("d-none");
        $("#reponse").addClass("d-none");
        $("#A, #B, #C, #D").off("click");

    });
}

function getSolution(solu) {

    $("#A, #B, #C, #D").off("click");
    solution = solu;
    $("#reponse").removeClass("d-none");
    $("#waitSolution").addClass("d-none");
    setSolution("afficher", solution);
}

function getScore(end) {

    $("#reponse").addClass("d-none");

    if(end){ // si c'est la fin du jeu
        $("#waitMessage").removeClass("d-none");
    }
    else {
      
      $("#waitQuestion").removeClass("d-none");
    }

}


function startDisplay() {
    $("#waitMessage").addClass("d-none");
    $("#reponse").removeClass("d-none");
}





