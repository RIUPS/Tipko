const express = require("express");
const router = express.Router();
const { upsertChallenge, getChallenges } = require("../services/universalChallengeService");

// Create or update a challenge
router.post("/", async (req, res) => {
  try {
    const { fingerprint, type, ...data } = req.body;
    if (!fingerprint || !type) {
      return res.status(400).json({ error: "Missing fingerprint or type" });
    }
    const challenge = await upsertChallenge(fingerprint, type, data);
    res.json({ message: "Challenge saved", challenge });
  } catch (err) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

// Get all challenges for a fingerprint and type
router.get("/", async (req, res) => {
  try {
    const { fingerprint, type } = req.query;
    if (!fingerprint || !type) {
      return res.status(400).json({ error: "Missing fingerprint or type" });
    }
    const challenges = await getChallenges(fingerprint, type);
    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

module.exports = router;