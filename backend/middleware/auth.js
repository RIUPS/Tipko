const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const roleCheck = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};

const getUserIdPathParam = (req) => {
    const { userId } = req.params;
    if (!userId) {
        throw new Error('User ID parameter is required');
    }
    if (userId === 'self') {
        return req.user._id;
    }
    if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
        throw new Error('Not authorized');
    }
    return userId;
}

module.exports = { authMiddleware, roleCheck, getUserIdPathParam };
