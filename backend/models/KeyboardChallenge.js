const mongoose = require("mongoose");

const keyboardChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  errors: {
    type: Number,
    required: true,
  },
  quoteLength: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("KeyboardChallenge", keyboardChallengeSchema);
