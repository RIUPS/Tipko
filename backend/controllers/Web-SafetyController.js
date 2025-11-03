const WebSafetyChallenge = require("../models/Web-SafetyChallenge");

// Shrani rezultat kviza
exports.saveResult = async (req, res) => {
  try {
    const { user, score, totalQuestions, date } = req.body;

    if (!user || typeof score !== "number" || typeof totalQuestions !== "number") {
      return res.status(400).json({ message: "Manjkajoči ali napačni podatki." });
    }

    const result = new WebSafetyChallenge({
      user,
      score,
      totalQuestions,
      date: date ? new Date(date) : new Date(),
    });

    await result.save();
    res.status(201).json({ message: "Rezultat uspešno shranjen.", result });
  } catch (err) {
    res.status(500).json({ message: "Napaka pri shranjevanju rezultata.", error: err.message });
  }
};

// Pridobi vse rezultate (po želji: za določenega uporabnika)
exports.getResults = async (req, res) => {
  try {
    const { user } = req.query;
    let query = {};
    if (user) query.user = user;

    const results = await WebSafetyChallenge.find(query).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Napaka pri pridobivanju rezultatov.", error: err.message });
  }
};