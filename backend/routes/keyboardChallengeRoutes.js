const express = require("express");
const router = express.Router();
const keyboardChallengeController = require("../controllers/keyboardChallengeController");

router.get("/", keyboardChallengeController.getAllKeyboardChallenges);
router.get("/exists/:id", keyboardChallengeController.challengeExists);
router.get("/:id", keyboardChallengeController.getKeyboardChallengeById);
router.post("/", keyboardChallengeController.createKeyboardChallenge);
router.put("/:id", keyboardChallengeController.updateKeyboardChallenge);
router.delete("/:id", keyboardChallengeController.deleteKeyboardChallenge);

module.exports = router;
