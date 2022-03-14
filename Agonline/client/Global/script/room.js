const socket = io();

const params = new URLSearchParams(window.location.search)
const out = params.get('alert');

if(out != undefined){
    putAlert("La room a été fermé !");
}

let codeRoom;

$(".room-inputarea").on("submit", function( event ) {
    event.preventDefault();
    codeRoom = $("#roomInput").val();
    socket.emit("checkRoom", codeRoom);
    
});

socket.on("checkRoom", (destination) => {
    window.location.href = destination;
});

socket.on("alert", (txt) => putAlert(txt));


function putAlert(txt){

    $("#loginAlert").text(txt).addClass("alertLog");
    setTimeout(() => {
        $("#loginAlert").removeClass("alertLog");
    }, 1500);

}
