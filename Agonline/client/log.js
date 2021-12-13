const socket = io();
let nomUtilisateur;

socket.on("userNumber", (number) => {
    $("#userNumberLog").text(number);
});


$(".name-inputarea").on("submit", function( event ) {
    event.preventDefault();
    nomUtilisateur = $("#nameInput").val();
    socket.emit("checkLog", nomUtilisateur);
    
});

socket.on("checkLog", (destination) => {
    localStorage.setItem('name',nomUtilisateur);
    window.location.href = destination;
});



socket.on("alert", (txt) => {
    $("#loginAlert").text(txt).addClass("alert");
    setTimeout(() => {
        $("#loginAlert").removeClass("alert");
    }, 1500);
});


