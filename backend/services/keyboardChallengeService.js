const KeyboardChallenge = require("../models/KeyboardChallenge");

const getAllKeyboardChallenges = async (filters = {}) => {
  const query = { ...filters };

  const challenges = await KeyboardChallenge.find(query)
    .sort({ order: 1 })
    .lean();

  return challenges;
};

const getKeyboardChallengeById = async (challengeId) => {
  const challenge = await KeyboardChallenge.findById(challengeId).lean();
  return challenge;
};

const getChallengesByUser = async (userId) => {
  const challenges = await KeyboardChallenge.find({ user: userId })
    .sort({ order: 1 })
    .lean();

  return challenges;
};

const createChallenge = async (challengeData) => {
  const lesson = await KeyboardChallenge.create(challengeData);
  return lesson;
};

const updateChallenge = async (challengeId, updateData) => {
  const challenge = await KeyboardChallenge.findByIdAndUpdate(
    challengeId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return challenge;
};

const deleteChallenge = async (challengeId) => {
  const challenge = await KeyboardChallenge.findByIdAndDelete(challengeId);
  return challenge;
};

const challengeExists = async (challengeId) => {
  const exists = await KeyboardChallenge.exists({ _id: challengeId });
  return !!exists;
};

module.exports = {
  getAllKeyboardChallenges,
  getKeyboardChallengeById,
  getChallengesByUser,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  challengeExists,
};
