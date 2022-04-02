const socket = io();
let nomUtilisateur;


const params = new URLSearchParams(window.location.search)
const room = params.get('room');

$("#codeRoom").text(room);


socket.on("userNumber", (number) => {
    $("#userNumberLog").text(number);
});

socket.emit("userNumber", room);


$(".name-inputarea").on("submit", function( event ) {
    event.preventDefault();
    nomUtilisateur = $("#nameInput").val();
    socket.emit("checkLog", nomUtilisateur,room);
    
});

socket.on("checkLog", (destination) => {
    localStorage.setItem('name',nomUtilisateur);
    window.location.href = destination;
});


socket.on("alert", (txt) => setAlert(txt));

function setAlert(txt){
    $("#loginAlert").text(txt).addClass("alertLog");
    setTimeout(() => {
        $("#loginAlert").removeClass("alertLog");
    }, 1500);
}

socket.on("waitingQueue", (info) => {
   
    $("#waitingPlace").text(info.place);
    $("#waitingNumber").text(info.total);
    setAlert(info.txt);

    $("#connexionForm").addClass("d-none");
    $("#waitInfo").removeClass("d-none");

    socket.on("waitingNumber",(totalNumber) => $("#waitingNumber").text(totalNumber));

});






