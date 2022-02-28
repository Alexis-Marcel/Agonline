const { Game } = require("./game.js");
const { io } = require("../server.js");
const { getUserById } = require("../users.js");

const mysql = require("mysql");

const nombreQuestionQuizz = 5;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "agonline",
});

db.connect((err) => {
    if (err) {
         throw "CONNEXION A LA BASE IMPOSSIBLE\n\n" + err;
     }
 });


class Quizz extends Game {

    constructor(socketCreateur,type) {
        super(socketCreateur);

        this.destinationClient = "../Quizz/quizzPlayer.html?room=" + this.codeRoom;

        this.typeQuestion = type;

        this.start = false;

        this.timerStoper = undefined;
        this.questCourante = 0;
        this.affichageEvent = 0;
        this.timeleft = 0;
        this.nbReponse = 0;

        this.socketCreateur.on("afficherQuestion", () => this.getQuestion());
        this.socketCreateur.on("afficherSolution", () => this.getSolution());
        this.socketCreateur.on("afficherScore", () => this.getScore());

        this.setUpStart();
        this.socketCreateur.on("start", () => this.startGame());
    }

    async setUpStart(){

         this.allQuestion = await getQuestionByType(this.typeQuestion);
        if(this.allQuestion.length < nombreQuestionQuizz){
            throw "Pas assez de question";
        }   
    }


    startGame() {

        this.start = true;
        this.tabQuestion = [];


        var questionAleatoire = [];
        while (questionAleatoire.length < nombreQuestionQuizz) {
            var r = Math.floor(Math.random() * this.allQuestion.length-1) + 1;
            if (questionAleatoire.indexOf(r) === -1) questionAleatoire.push(r);
        }

        for (let i = 0; i < nombreQuestionQuizz; i++) {

            let set = this.allQuestion[questionAleatoire[i]];
            let questionObject = { question: set.Question, reponse: [set.ReponseA, set.ReponseB, set.ReponseC, set.ReponseD], correct: set.BonneReponse };
            this.tabQuestion.push(questionObject);

        }


        this.questCourante = 0;
        io.to(this.codeRoom).emit("start");
        this.getQuestion();
        this.users.forEach(user => {
            user.score = 0;
            user.socket.emit("majScore", user.score)
        });
    }

    addUser(socket, name) {
        const user = super.addUser(socket, name);

        socket.on("score", (reponse) => {
            this.nbReponse++;
            this.socketCreateur.emit("nbReponse", this.nbReponse, this.users.length);
            if (reponse == this.tabQuestion[this.questCourante].correct) {
                user.score++;

            }

            if (this.nbReponse == this.users.length) {
                this.getSolution();
            }

        });
    }


    getQuestion() {

        clearInterval(this.timerStoper);
        this.affichageEvent++;
        this.nbReponse = 0;
        this.socketCreateur.emit("nbReponse", this.nbReponse, this.users.length);
        
        this.socketCreateur.emit("nbQuestion", this.questCourante+1, nombreQuestionQuizz);

        this.timer(10);  

        this.socketCreateur.emit("affichageQuestion", this.tabQuestion[this.questCourante]);
        io.to(this.codeRoom).emit("question");



    }

    getSolution() {

        clearInterval(this.timerStoper);
        this.affichageEvent++;
        this.timer(5);
        this.users.forEach(user => user.socket.emit("majScore", user.score));
        io.to(this.codeRoom).emit("solution", this.tabQuestion[this.questCourante].correct);

    }

    getScore() {


        clearInterval(this.timerStoper);
        this.affichageEvent = 0;
        this.questCourante++;

        if (this.questCourante == this.tabQuestion.length) {

            this.socketCreateur.emit("affichageScore", this.getTabScore(), true);
            io.to(this.codeRoom).emit("score", true);
            this.start=false;
        }
        else {
            this.timer(5);
            this.socketCreateur.emit("affichageScore", this.getTabScore(), false);
            io.to(this.codeRoom).emit("score", false);
        }


    }

    getTabScore() {
        let tab = [];
        this.users.forEach(user => tab.push({ name: user.name, score: user.score }));
        return tab;
    }



    timer(time) {

        this.timeleft = time-1;
        this.socketCreateur.emit("timer", time);

        this.timerStoper = setInterval(() => this.timeFunction(), 1000);
    }

    timeFunction() {

        if (this.timeleft >= 0) {
            this.socketCreateur.emit("timer", this.timeleft);
        }
        else {
            switch (this.affichageEvent) {
                case 0:
                    this.getQuestion();
                    break;
                case 1:
                    this.getSolution();
                    break;
                case 2:
                    this.getScore();
                    break;
            };
        }
        this.timeleft -= 1;
    }

}



getQuestionByType = (typeQuestion) => {
    console.log("get");
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM quizz inner join categorie ON quizz.Categorie = categorie.CategorieID inner join question ON quizz.Question = question.QuestionID where categorie.CategorieType ="'+typeQuestion+'"', (error, question) => {
            if (error) {
                return reject(error);
            }
            return resolve(question);
        });
    });
};


module.exports = { Quizz };