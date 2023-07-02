const mongoose = require("mongoose");
const { mongoHost } = require("../utils/hosts");

module.exports = mongoose
  .connect(`mongodb://${mongoHost}:27017/chat-application`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
