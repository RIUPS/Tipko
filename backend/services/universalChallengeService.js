const UniversalChallenge = require("../models/UniversalChallenge");

function isBetter(newData, existing) {
  // Prefer higher points, then shorter time if points are equal
  if (typeof newData.points === "number" && typeof existing.points === "number") {
    if (newData.points > existing.points) return true;
    if (newData.points < existing.points) return false;
    // If points are equal, prefer shorter time (if available)
    if (typeof newData.time === "number" && typeof existing.time === "number") {
      return newData.time < existing.time;
    }
  }
  // If points not present, fallback to shorter time if available
  if (typeof newData.time === "number" && typeof existing.time === "number") {
    return newData.time < existing.time;
  }
  // Otherwise, always allow update
  return true;
}

async function upsertChallenge(fingerprint, type, data) {
  // Find the best previous challenge for this user and type
  let challenge = await UniversalChallenge.findOne({ fingerprint, type }).sort({ points: -1, time: 1 });
  if (challenge) {
    if (isBetter(data, challenge)) {
      Object.assign(challenge, data, { timestamp: new Date() });
      await challenge.save();
      return challenge;
    } else {
      // Don't update, just return the existing best challenge
      return challenge;
    }
  } else {
    challenge = new UniversalChallenge({ fingerprint, type, ...data });
    await challenge.save();
    return challenge;
  }
}

async function getChallenges(fingerprint, type) {
  return UniversalChallenge.find({ fingerprint, type }).sort({ timestamp: -1 });
}

module.exports = { upsertChallenge, getChallenges };