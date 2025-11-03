const express = require("express");
const router = express.Router();
const controller = require("../controllers/Web-SafetyController");

// Shrani rezultat kviza
router.post("/results", controller.saveResult);

// Pridobi vse rezultate (ali za določenega uporabnika ?user=ime)
router.get("/results", controller.getResults);

module.exports = router;