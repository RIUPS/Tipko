const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  challengeType: { type: String, required: true },
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
});