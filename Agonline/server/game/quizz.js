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

        this.typeQuestion = type;

        this.timerStoper = undefined;
        this.questCourante = 0;
        this.affichageEvent = 0;
        this.timeleft = 0;
        this.nbReponse = 0;

        this.socketCreateur.on("afficherQuestion", () => this.getQuestion());
        this.socketCreateur.on("afficherSolution", () => this.getSolution());
        this.socketCreateur.on("afficherScore", () => this.getScore());

        this.socketCreateur.on("start", () => this.setUpStart());
    }

    async setUpStart() {


        const nbQuestionDispo = await getNbQuestionDispo(this.typeQuestion);
        this.tabQuestion = [];

        var questionAleatoire = [];
        while (questionAleatoire.length < nombreQuestionQuizz) {
            var r = Math.floor(Math.random() * nbQuestionDispo) + 1;
            if (questionAleatoire.indexOf(r) === -1) questionAleatoire.push(r);
        }


        for (let i = 0; i < nombreQuestionQuizz; i++) {

            let set = await getQuestionById(questionAleatoire[i],this.typeQuestion);
            let questionObject = { question: set.Question, reponse: [set.ReponseA, set.ReponseB, set.ReponseC, set.ReponseD], correct: set.BonneReponse };
            this.tabQuestion.push(questionObject);

        }

        console.log("--------------------------------");
        console.log(this.tabQuestion);
        this.questCourante = 0;
        io.to(this.codeRoom).emit("start");
        this.getQuestion();
        this.users.forEach(user => {
            user.score = 0;
            user.socket.emit("majScore", user.score)
        });
    }

    addUser(socket, name) {
        super.addUser(socket, name);

        socket.on("score", (reponse) => {
            this.nbReponse++;
            this.socketCreateur.emit("nbReponse", this.nbReponse, this.users.length);
            if (reponse == this.tabQuestion[this.questCourante].correct) {
                getUserById(this.users, socket.id).score++;

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

        this.timeleft = time;
        this.timerStoper = setInterval(() => this.timeFunction(), 1000);
    }

    timeFunction() {

        if (this.timeleft >= 0) {
            io.to(this.codeRoom).emit("timer", this.timeleft);
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



getNbQuestionDispo = (typeQuestion) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT count(*)as nb FROM quizz natural join categorie where CategorieType="'+typeQuestion+'" ', (error, nbQuestion) => {
            if (error) {
                return reject(error);
            }
            return resolve(nbQuestion[0].nb);
        });
    });
};

getQuestionById = (id,typeQuestion) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM quizz inner join categorie ON quizz.Categorie = categorie.CategorieID inner join question ON quizz.Question = question.QuestionID where categorie.CategorieType ="'+typeQuestion+'" and question.QuestionID="' + id + '"', (error, question) => {
            if (error) {
                return reject(error);
            }
            return resolve(question[0]);
        });
    });
};


module.exports = { Quizz };