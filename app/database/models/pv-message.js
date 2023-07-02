const mongoose = require("mongoose");

const pvMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAT: {
    type: Date,
    default: Date.now(),
  },
});

pvMessageSchema.index({ sender: 1, receiver: 1 });
pvMessageSchema.index({ receiver: 1, sender: 1 });

const pvMessageModel = mongoose.model("PV-messages", pvMessageSchema);

module.exports = pvMessageModel;
