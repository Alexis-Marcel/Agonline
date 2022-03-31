export { initClient, initMaster }


/**
 * fonction commune à tout les clients
 */
function initClient(socket, start, init) {

    /**
     * récupération des paramètres permettant de créer l'utilisateur
     */
    const nom = localStorage.getItem('name');

    const params = new URLSearchParams(window.location.search)
    const room = params.get('room');

    /**
     * connexion de l'utilisateur à la salle
     */
    socket.emit("login", nom, room); // DEMANDE DE  CONNEXION

    /**
     * INITIALISATION DU JEU UNE FOIS LA CONNEXION APPROUVE
     */
    socket.on("login", () => {


        socket.on("start", () => start()); // LANCEMENT DU JEU

        socket.on("getOut", (destination) => window.location.href = destination); //FERMETURE DE LA ROOM

        /**
         *initialisation du nombre de joueurs présent dans la salle
        */
        socket.on("userNumber", (number) => {
            $("#userNumberChat").text(number);
        });
        socket.emit("userNumber", room);

        initialisationDuChat(socket,"joueur");

        init(); // initialisation dépendante de chaque game

    });


}


/**
 * fonction commune à tout les master
 */
function initMaster(socket, init, nomGame, type = null) {

    socket.emit(nomGame,type); // DEMANDE DE CREATION DU JEU

    /**
     * INITIALISATION UNE FOIS LA ROOM CREER DANS LE SERVEUR
     */
    let codeRoom;
    socket.on("codeRoom", (code) => {
        
        codeRoom = code;

        /**
         * inscription du code à l'écran
         */
        $("#codeRoom").val(codeRoom);
        $("#codeRoomQrcode").text("Code de la room : " + codeRoom);


        /**
         * initialisation du bouton pour lancer le jeu
         */
        $("#start-button").on("click", function () {
            socket.emit("start");
        });

        initialisationDuChat(socket,"createur"); // initialisation du chat

        init(); //initialisation qui change en fonction des jeux

        socket.emit("userNumber", codeRoom);

        /**
         * CREATION DU QRCODE
         */
        creerQRC(codeRoom);

        /**
         *initialisation du nombre de joueurs présent dans la salle
        */
        socket.on("userNumber", (number) => {
            $("#nombreJoueur").val(number);
            $("#userNumberChat").text(number);
        });

        socket.on("alert",(message) => {
            alert(message);
        });

        
    });

    return codeRoom;


}

function initialisationDuChat(socket,type) {

    /**************************
    * INITIALISATION DU CHAT *
    *************************/

    /**
     * ouvrir la fenetre du chat
     */
    $('.js-menu-toggle').on("click", function (e) {

        var $this = $(this);

        $('#icon-message').toggleClass("fas");
        $('#icon-message').toggleClass("far");

        $('body').toggleClass('show-sidebar');
        e.preventDefault();

    });

    /**
     * Fermer la fenetre du chat
     */
    $(document).on("mouseup", function (e) {
        var container = $(".sidebar");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('body').removeClass('show-sidebar');

            $('#icon-message').removeClass("fas");
            $('#icon-message').addClass("far");
        }
    });

    /**
    * envoie de messages dans le chat
    */
    $(".msg-inputarea").on("submit", function (event) {
        event.preventDefault();
        var text = $("#messageInput").val();
        if(type == "joueur") socket.emit("clientMessage", text);
        else socket.emit("creatorMessage", text);
        $("#messageInput").val("").focus();
    });

    /**
     * écoute des messages du chat
     */
    socket.on("serverMessage", displayMessage);

    /******************************
     * FIN INITIALISATION DU CHAT *
     *****************************/

}

function displayMessage(serverMessage) {
    const timeStamp = $("<span></span>").text(getTime()).addClass("timeStamp");
    const userInfo = $("<span></span>")
        .text(`${serverMessage.name}: `)
        .css("color", serverMessage.color)
        .css("font-weight", serverMessage.weight);
    const messageText = $("<span></span>")
        .text(serverMessage.text)
        .css("color", serverMessage.color)
        .css("font-style", serverMessage.style)
    const message = $("<div></div>")
        .addClass("message")
        .append(timeStamp)
        .append(userInfo)
        .append(messageText);
    $("#messages")
        .append(message)
        .scrollTop(function () {
            return this.scrollHeight;
        });
}

function getTime() {
    const currentDate = new Date();
    const timeOption = { hour: "2-digit", minute: "2-digit" };
    return currentDate.toLocaleTimeString([], timeOption);
}


function creerQRC(codeRoom) {
    let url = window.location.origin + "/RoomConnexion/joinGame.html?room=" + codeRoom;
    let qrc = "https://chart.googleapis.com/chart?cht=qr&chl=" + encodeURIComponent(url) + "&chs=200x200&choe=UTF-8&chld=L|0";
    $("#img-qrcode").attr("src", qrc);
    console.log(url);
}