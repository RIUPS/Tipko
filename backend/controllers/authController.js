const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    const result = await authService.register({ fingerprint });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    try {
      const result = await authService.login({ fingerprint });
      res.json({ success: true, data: result });
    } catch (err) {
      if (err.message === "Invalid credentials") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    try {
      const result = await authService.logout({ fingerprint });
      if (result) {
        res.json({ success: true });
      }
      res.json({ success: false });
    } catch (err) {
      if (err.message === "Invalid credentials") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const check = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    const exists = await authService.check(fingerprint);
    res.json({ success: true, exists });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, check, logout };
