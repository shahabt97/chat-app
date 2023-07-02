const mongoose = require("mongoose");

const publicMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAT: {
    type: Date,
    default: Date.now(),
  },
});

publicMessageSchema.index({ sender: 1});

const publicMessageModel = mongoose.model("Public-messages", publicMessageSchema);

module.exports = publicMessageModel;
