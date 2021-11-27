var socket = io();

socket.on('chat message', receiveMessage);

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


let PERSON_NAME;

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    let nomValide = true;

    if(PERSON_NAME === undefined){
        nomValide = setName();
    }
  
    if(nomValide){
      const msgText = msgerInput.value;
      if (!msgText) return;
    
      sendMessage(msgText,PERSON_NAME);
      msgerInput.value = "";
    }
    
  });

  function sendMessage(text,name) {
    socket.emit('chat message', text, name);
  }

  function receiveMessage(text,side,name) {
   
    
    msgerChat.insertAdjacentHTML("beforeend", createMessage(text,side,name));
    msgerChat.scrollTop += 500;
  }

  function createMessage(text,side,name){
     // <div class="msg-img" style="background-image: url(${img})"></div>
    const msgHTML = `
    <div class="msg ${side}-msg"> 
      
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
    `;

    return msgHTML;
  }

  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }

  function get(selector, root = document) {
    return root.querySelector(selector);
  }

  function setName() {
    let text;
    let person = prompt("Pour envoyer des messages vous devez préciser votre pseudo :");
    if (person == null || person == ""){
        alert("Votre pseudo est vide");
        return false;
    }

    if(person.length > 16){
      alert("Votre pseudo est trop long !");
        return false;
    }

    
    
    PERSON_NAME = person;
    return true;
  }