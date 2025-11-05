const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_jwt_secret",
    { expiresIn: "7d" }
  );
};

const register = async ({ fingerprint }) => {
  const existing = await User.findOne({ fingerprint });
  if (existing) {
    throw new Error("Fingerprint already in use");
  }
  const user = await User.create({ fingerprint });
  const token = generateToken(user);
  return { user, token };
};

const login = async ({ fingerprint }) => {
  const user = await User.findOne({ fingerprint });
  if (!user) throw new Error("Invalid credentials");
  const token = generateToken(user);
  return { user, token };
};

const logout = async ({ fingerprint }) => {
  const user = await User.deleteOne({ fingerprint });
  if (user.deletedCount == 0) {
    return false;
  }
  return true;
};

const check = async (fingerprint) => {
  const user = await User.findOne({ fingerprint });
  return !!user;
};

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");

module.exports = { generateToken, register, login, verifyToken, check, logout };
