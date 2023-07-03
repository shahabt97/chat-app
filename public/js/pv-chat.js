async function init() {
  console.log(`${socket.id} is here 1`);

  const path = window.location.pathname;
  const hostUser = path.split("/")[2];
  const data = await axios.get(`http://localhost:3000/get-user-id`);

  const messages = await axios.get(
    `http://localhost:3000/get-messages?hostUser=${hostUser}&username=${data.data.username}&status=pv`
  );

  await getMessages(messages.data);

  console.log(`${socket.id} is here 1`);

  // Connect to Socket.IO server
  const socket = io(
    `/pv-chat?hostUser=${hostUser}&username=${data.data.username}`
  );

  const inputBoxForm = document.getElementById("inputBoxForm");
  const submitButton = document.getElementById("submitButton");
  const onlineUsers = document.getElementById("onlineUsers");

  inputBoxForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(`${socket.id} is here 8`);
    sendMessage();
  });
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  socket.on("check", () => {
    console.log(`${socket.id} is here 2`);

    for (let i = 0; i < 100; i++) {
      if (i === 50) {
        console.log("parsedData");
      }
      if (localStorage.getItem(`${i}`)) {
        const storedData = localStorage.getItem(`${i}`);
        const parsedData = JSON.parse(storedData);

        if (socket.connected) {
          socket.emit("chat message", parsedData);
          localStorage.removeItem(`${i}`);
          console.log(`${socket.id} is here 6`);

        }
      }
    }
  });

  // Function to send a new message
  function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    const username = data.data.username;
    const userId = data.data.id;

    // Get the current timestamp
    const timestamp = new Date();

    if (message !== "") {
      // Create an object with the message, username, and timestamp
      const messageData = {
        message,
        username,
        userId,
        timestamp,
      };

      console.log(`${socket.id} is here 3`);

      // Emit the 'newMessage' event to the server with the message data
      if (socket.connected) {
        socket.emit("chat message", messageData);
        console.log(`${socket.id} is here 4`);

        // Clear the input field
        messageInput.value = "";
      } else {
        for (let i = 0; i < 100; i++) {
          console.log(`${socket.id} is here 5`);

          if (!localStorage.getItem(`${i}`)) {
            localStorage.setItem(`${i}`, JSON.stringify(messageData));
            break;
          }
        }
      }
    }
  }

  // Function to handle incoming messages
  function receiveMessage(messageData) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    //   messageElement.classList.add("message");

    // Create HTML structure for the message
    messageElement.innerHTML = `<div class="message">
              <span class="sender">${messageData.username}:</span>
              <span class="timestamp">${formatDate(
                messageData.timestamp
              )}</span>
              <p>${messageData.message}</p>`;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Listen for 'newMessage' event from the server
  socket.on("chat message", (messageData) => {
    console.log(`${socket.id} is here 7`);

    receiveMessage(messageData);
  });

  async function getMessages(messages) {
    const chatBox = document.getElementById("chatBox");
    //   messageElement.classList.add("message");
    // console.log(messages);
    for (let i = 0; i < messages.length; i++) {
      const messageElement = document.createElement("div");
      messageElement.innerHTML = `<div class="message">
      <span class="sender">${messages[i].sender.username}:</span>
      <span class="timestamp">${formatDate(messages[i].createdAT)}</span>
      <p>${messages[i].message}</p>`;

      chatBox.appendChild(messageElement);
    }
    chatBox.scrollTop = chatBox.scrollHeight;

    // Create HTML structure for the message
  }
}
function formatDate(dateTimeStr) {
  // const date = new Date();

  // Format in ISO format
  const date = new Date(dateTimeStr);
  // console.log(date);
  const options = { hour: "numeric", minute: "numeric", weekday: "long" };
  const formattedTime = date.toLocaleString("en-US", options);
  // console.log(formattedTime);

  // const [dayOfWeek, time] = formattedTime.split(",");
  // const [hour, minute] = time.split(":");

  return formattedTime;
}
