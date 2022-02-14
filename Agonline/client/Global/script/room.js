const socket = io();

let codeRoom;


$(".room-inputarea").on("submit", function( event ) {
    event.preventDefault();
    codeRoom = $("#roomInput").val();
    socket.emit("checkRoom", codeRoom);
    
});
socket.on("checkRoom", (destination) => {
    window.location.href = destination;
});

socket.on("alert", (txt) => {
    $("#loginAlert").text(txt).addClass("alertLog");
    setTimeout(() => {
        $("#loginAlert").removeClass("alertLog");
    }, 1500);
});
