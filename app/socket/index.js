function socketInitial(app) {
  const { Server } = require("socket.io");
  const axios = require("axios");

  const PublicMessage = require("../database/models/public-message");
  const PvMessage = require("../database/models/pv-message");
  const UserModel = require("../database/models/user");
  const { apiKey } = require("../utils/hosts");

  const { createServer } = require("http");

  const server = createServer(app);
  const io = new Server(server);

  let users = {};

  io.of("/public-chat").on("connection", async (socket) => {
    const username = socket.handshake.query.username;

    users[socket.id] = username;

    io.of("/public-chat").emit("online", users);

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.of("/public-chat").emit("online", users);
    });

    const soc = io.of("/public-chat").sockets;
    for (const socketId of soc.keys()) {
      // console.log(`Socket ID: ${socketId}`);
    }

    socket.on("chat message", async (data) => {
      PublicMessage.create({ message: data.message, sender: data.userId })
        .then((user) => {
          io.of("/public-chat").emit("chat message", data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  const socketData = {};
  const remainedMessages = {};

  io.of("/pv-chat").on("connection", async (socket) => {
    const hostUser = socket.handshake.query.hostUser;
    const username = socket.handshake.query.username;
    // console.log(`${username} connected`);
    if (username === "shahab") {
      console.log(`${socket.id} is here 0`);
    }

    // console.log(socket.connected);

    socket.on("disconnect", () => {
      delete socketData[socket.id];
      // console.log(`${username} disconnected`);
      if(username==="shahab"){
        console.log(`${socket.id} is here 11`);
      }
    });

    if (remainedMessages[username]) {
      if (remainedMessages[username].hostId) {
        if (username === "shahab") {
          console.log(`${socket.id} is here 8`);
        }
        io.of("/pv-chat")
          .to([socket.id, remainedMessages.hostId])
          .emit("chat message", data);
        delete remainedMessages[username];
        if(username==="shahab"){
          console.log(`${socket.id} is here 10`);
        }
      } else {
        io.of("/pv-chat").to(socket.id).emit("chat message", data);
        if(username==="shahab"){
          console.log("we are here 9")
        }
      }
    }

    // check if there is message in client-side
    socket.emit("check");
    if (username === "shahab") {
      console.log(`${socket.id} is here 1`);
    }

    socketData[socket.id] = { user: username, host: hostUser };
    // const user = await UserModel.findOne({ username: hostUser });

    socket.on("chat message", async (data) => {
      if (username === "shahab") {
        console.log(`${socket.id} is here 2`);
      }
      axios
        .post(
          "http://localhost:3000/save-pv-messages",
          {
            data,
            user: username,
            host: hostUser,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        )
        .then((data) => {
          if (data.data.isSaved) {
            // console.log("message saved successfully");
          }
        })
        .catch((err) => {
          // console.log("message saving failed.");
          console.log(err);
        });
      const soc = io.of("/pv-chat").sockets;

      for (const socketId of soc.keys()) {
        // console.log("user: ");
        // console.log(socketData[socketId]);

        if (
          socketData[socketId].user === hostUser &&
          socketData[socketId].host === username
        ) {
          if (username === "shahab") {
            console.log(`${socket.id} is here 3`);
          }
          if (socket.connected) {
            if (username === "shahab") {
              console.log(`${socket.id} is here 4`);
            }

            return io
              .of("/pv-chat")
              .to([socket.id, socketId])
              .emit("chat message", data);
          } else {
            remainedMessages[username] = { data, hostId: socketId };
            if(username==="shahab"){
              console.log(`${socket.id} is here 5`);
            }
          }
        }
      }
      if (socket.connected) {
        io.of("/pv-chat").to(socket.id).emit("chat message", data);
        if(username==="shahab"){
          console.log(`${socket.id} is here 6`);
        }
      } else {
        remainedMessages[username] = { data, hostId: null };
        if(username==="shahab"){
          console.log(`${socket.id} is here 7`);
        }
      }
    });

    // console.log("this is it")
  });
  return server;
}

module.exports = socketInitial;
