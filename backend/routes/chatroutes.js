const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const Message = require("../models/Message");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// SEND MESSAGE
router.post("/", async (req, res) => {

  try {

    const { message, userId } = req.body;

    const completion =
      await client.chat.completions.create({

        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

    const botReply =
      completion.choices[0].message.content;

    // SAVE MESSAGE
    const newMessage = new Message({
      userId: userId,
      userMessage: message,
      botReply: botReply,
    });

    await newMessage.save();

    res.json({
      reply: botReply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// GET USER CHAT HISTORY
router.get(
  "/history/:userId",
  async (req, res) => {

    try {

      const messages =
        await Message.find({
          userId: req.params.userId,
        });

      res.json(messages);

    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;