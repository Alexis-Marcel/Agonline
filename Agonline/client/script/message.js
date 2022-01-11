export function displayMessage(serverMessage, messageInput) {
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

export function setSolution(param,solution){

    let sol = "#"+solution;
    if(param === "afficher"){
      $("#A, #B, #C, #D").parent().parent().removeClass("bg-light");
      $("#A, #B, #C, #D").parent().parent().addClass("text-white");
      $("#A, #B, #C, #D").parent().parent().removeClass("text-dark");
      $("#A, #B, #C, #D").parent().parent().addClass("bg-danger");
      $(sol).parent().parent().removeClass("bg-danger");
      $(sol).parent().parent().addClass("bg-success");
    }
    else {
      $("#A, #B, #C, #D").parent().parent().addClass("bg-light");
      $("#A, #B, #C, #D").parent().parent().removeClass("text-white");
      $("#A, #B, #C, #D").parent().parent().addClass("text-dark");
      $("#A, #B, #C, #D").parent().parent().removeClass("bg-danger");
      $(sol).parent().parent().removeClass("bg-success");
    }
    
  }
