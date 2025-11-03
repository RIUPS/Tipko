const keyboardService = require("../services/keyboardChallengeService");

const getAllKeyboardChallenges = async (req, res, next) => {
  try {
    const keyboardChallenges = await keyboardService.getAllKeyboardChallenges();
    res.json({ success: true, data: keyboardChallenges });
  } catch (err) {
    next(err);
  }
};

const getKeyboardChallengeById = async (req, res, next) => {
  try {
    const keyboardChallenge = await keyboardService.getKeyboardChallengeById(
      req.params.id
    );
    if (!keyboardChallenge)
      return res
        .status(404)
        .json({ success: false, message: "Lekcija ni najdena" });
    res.json({ success: true, data: keyboardChallenge });
  } catch (err) {
    next(err);
  }
};

const createKeyboardChallenge = async (req, res, next) => {
  try {
    const keyboardChallenge = await keyboardService.createChallenge(req.body);
    res.status(201).json({ success: true, data: keyboardChallenge });
  } catch (err) {
    next(err);
  }
};

const updateKeyboardChallenge = async (req, res, next) => {
  try {
    const keyboardChallenge = await keyboardService.updateChallenge(
      req.params.id,
      req.body
    );
    if (!keyboardChallenge)
      return res
        .status(404)
        .json({ success: false, message: "Vaja tipkovnice ni najdena" });
    res.json({ success: true, data: keyboardChallenge });
  } catch (err) {
    next(err);
  }
};

const deleteKeyboardChallenge = async (req, res, next) => {
  try {
    const keyboardChallenge = await keyboardService.deleteChallenge(
      req.params.id
    );
    if (!keyboardChallenge)
      return res
        .status(404)
        .json({ success: false, message: "Vaja tipkovnice ni najdena" });
    res.json({ success: true, data: keyboardChallenge });
  } catch (err) {
    next(err);
  }
};

const challengeExists = async (req, res, next) => {
  try {
    const result = await keyboardService.challengeExists(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllKeyboardChallenges,
  getKeyboardChallengeById,
  createKeyboardChallenge,
  updateKeyboardChallenge,
  deleteKeyboardChallenge,
  challengeExists,
};
