//required for front end communication between client and server
const socket = io();

const inboxPeople = document.querySelector(".inbox__people");


let userName = "";
let id;
const newUserConnected = function (data) {
    

    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = data;
    //console.log(typeof(userName));   
    

    //emit an event with the user id
    socket.emit("new user", userName);
    socket.emit("chat message", {
    message: `Welcome "${userName}" to the chat! `,
    nick: "Admin",
  });

   // socket.emit("chat message", userName);
    //call
    addToUsersBox(userName);
};

const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    
    }
    
    //setup the divs for displaying the connected users
    //id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <li>${userName}</li>
    </div>
  `;
    //set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

//call 
//newUserConnected("hasOwnPropertyifaeg4");

//when a new user event is detected
socket.on("new user", function (data) {
  data.map(function (user) {
          return addToUsersBox(user);
      });
    
////  socket.emit("chat message", {
///    message: "Welcome : ",
   /// nick: userName,
 /// });
});

//when a user leaves
socket.on("user disconnected", function (userName) {
    
    const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
    
    const messageBox = document.querySelector(".messages__history");
    if (userName !== null) {
    messageBox.innerHTML += `
  <div class="incoming__message">
    <div class="received__message  row ">
    <div style="">
      <p title="Admin @ ${formattedTime} " class="messageTextFormat recieverMessageBubbleDiv" style="background-color:green;">The user ${userName} just left! - Admin </p>
    </div>
    </div>
  </div>`;}
    
    
    
    document.querySelector(`.${userName}-userlist`).remove();
});


const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const idField = document.querySelector(".id_form__input");
const idForm = document.querySelector(".id_form");


const idRow = document.querySelector(".idRow");
const messageRow = document.querySelector(".messageRow");


const idErrorBox = document.querySelector(".id_error_box");

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message  row ">
    <div style="">
      <p title="${user} @ ${formattedTime}" class="messageTextFormat recieverMessageBubbleDiv">${message}  </p>
    </div>
    </div>
  </div>`;

  const myMsg = `
  <div class="outgoing__message" >
    <div class="sent__message  row">
      <div>
      <p title="${formattedTime}" class="messageTextFormat senderMessageBubbleDiv" >${message} </p></div>
    </div>
  </div>`;

  //is the message sent or received
  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";
});

// event listener for ID submit
idForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!idField.value) {
    return;
  }
    
  if (document.querySelector(`.${idField.value}-userlist`)) {
      console.log("we found one already!")
      idErrorBox.style.display = "block";
      
        return;
    }
   idErrorBox.style.display = "none";
   messageRow.style.display = "block";
     
  newUserConnected(idField.value);
  idRow.style.display =  'none'; 
});
/////////////////
socket.on("chat message", function (data) {
   if (data.nick != "Admin"){
  addNewMessage({ user: data.nick, message: data.message });
   } else{
       const messageBox = document.querySelector(".messages__history");
       const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
       
       messageBox.innerHTML += `
  <div class="incoming__message">
    <div class="received__message  row ">
    <div style="">
      <p title="Admin @ ${formattedTime}" class="messageTextFormat recieverMessageBubbleDiv" style="background-color:green;"> ${data.message} - Admin </p>
    </div>
    </div>
  </div>`;
   
   }
    
       
   }
);