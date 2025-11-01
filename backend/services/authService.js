const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });
};

const register = async ({ email, password, name }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');
  const user = await User.create({ email, password, name });
  const token = generateToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');
  const token = generateToken(user);
  return { user, token };
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');

module.exports = { generateToken, register, login, verifyToken };
