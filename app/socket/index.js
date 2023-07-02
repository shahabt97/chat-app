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

  io.of("/pv-chat").on("connection", async (socket) => {
    const hostUser = socket.handshake.query.hostUser;
    const username = socket.handshake.query.username;
    console.log(`${username} connected`);

    socket.on("disconnect", () => {
      delete socketData[socket.id];
      console.log(`${username} disconnected`);
    });

    socketData[socket.id] = { user: username, host: hostUser };
    // const user = await UserModel.findOne({ username: hostUser });

    socket.on("chat message", async (data) => {
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
            console.log("message saved successfully");
          }
        })
        .catch((err) => {
          console.log("message saving failed.");
          console.log(err);
        });
      const soc = io.of("/pv-chat").sockets;

      for (const socketId of soc.keys()) {

        console.log('user: ');
        console.log(socketData[socketId]);

        if (
          socketData[socketId].user === hostUser &&
          socketData[socketId].host === username
        ) {
          return io
            .of("/pv-chat")
            .to([socket.id, socketId])
            .emit("chat message", data);
        }
      }
      io.of("/pv-chat").to(socket.id).emit("chat message", data);
    });

    // console.log("this is it")
  });
  return server;
}

module.exports = socketInitial;
