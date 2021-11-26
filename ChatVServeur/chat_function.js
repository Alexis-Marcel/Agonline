var socket = io();

socket.on('chat message', receiveMessage);

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


const PERSON_NAME = "Moi";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();
  
    const msgText = msgerInput.value;
    if (!msgText) return;
  
    sendMessage(msgText);
    msgerInput.value = "";
    
  });

  function sendMessage(text) {
    socket.emit('chat message', text);
  }

  function receiveMessage(text,side) {
   
    
    msgerChat.insertAdjacentHTML("beforeend", createMessage(text,side));
    msgerChat.scrollTop += 500;
  }

  function createMessage(text,side){
     // <div class="msg-img" style="background-image: url(${img})"></div>
    const msgHTML = `
    <div class="msg ${side}-msg">
      
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">Anonyme</div>
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