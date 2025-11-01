const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register({ email, password, name });
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    try {
        const result = await authService.login({ email, password });
        res.json({ success: true, data: result });
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        throw err;
    }
  } catch (err) { next(err); }
};

module.exports = { register, login };
