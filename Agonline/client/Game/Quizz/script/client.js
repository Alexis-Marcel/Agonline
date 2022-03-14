const socket = io();
import { setSolution } from "./affichage.js";
import { initClient } from "../../scriptGlobal/global.js";



initClient(socket,startDisplay,init);

function init(){

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

}


let solution;

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





