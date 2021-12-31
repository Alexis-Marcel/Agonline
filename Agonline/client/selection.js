var reponse;
window.addEventListener('load', function () {

    const e1 = document.getElementById("repA");
    const e2 = document.getElementById("repB");
    const e3 = document.getElementById("repC");
    const e4 = document.getElementById("repD");

    e1.addEventListener("click", () => changerStyle("repA"));
    e2.addEventListener("click", () => changerStyle("repB"));
    e3.addEventListener("click", () => changerStyle("repC"));
    e4.addEventListener("click", () => changerStyle("repD"));

    timeleft = 10;
    var downloadTimer = setInterval(function(){
        if(timeleft <= 0){
            clearInterval(downloadTimer);
            document.getElementById("temps").innerHTML = "Finished";
            window.addEventListener("click", function(event) {
                event.stopImmediatePropagation();
            }, true);
            window.alert(reponse);
        } else {
            document.getElementById("temps").innerHTML = timeleft + " seconds remaining";
        }
        timeleft -= 1;
    }, 1000);
})

function changerStyle(rep){
    document.getElementById("repA").style.borderColor = "#333";
    document.getElementById("repB").style.borderColor = "#333";
    document.getElementById("repC").style.borderColor = "#333";
    document.getElementById("repD").style.borderColor = "#333";
    document.getElementById(rep).style.borderColor = "red";
    reponse = rep;
}

