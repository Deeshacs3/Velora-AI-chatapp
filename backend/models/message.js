const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  userMessage: String,
  botReply: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);