const mongoose = require("mongoose");

const UniversalChallengeSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true }, // changed from userId
  type: { type: String, enum: ["keyboard", "mouse", "digital-safety"], required: true },
  // Common fields
  points: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  // Keyboard-specific
  wpm: Number,
  cpm: Number,
  accuracy: Number,
  errors: Number,
  quoteLength: String,
  time: Number,
  // Mouse-specific
  clicks: Number,
  dragAccuracy: Number,
  mouseTime: Number,
  // Digital safety-specific
  score: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  // Add more fields as needed for future challenge types
});

UniversalChallengeSchema.index({ fingerprint: 1, type: 1, timestamp: -1 });

module.exports = mongoose.model("UniversalChallenge", UniversalChallengeSchema);