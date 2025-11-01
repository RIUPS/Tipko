const progressService = require('../services/progressService');
const { getUserIdPathParam } = require('../middleware/auth');

const getUserProgress = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const progress = await progressService.getUserProgress(targetUserId);
    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

const createUserProgress = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const progress = await progressService.createUserProgress(targetUserId, req.body.nickname);
    res.status(201).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

const saveLessonCompletion = async (req, res, next) => {
  try {
    const { score, timeSpent } = req.body;
    const targetUserId = getUserIdPathParam(req);
    const progress = await progressService.saveLessonCompletion(targetUserId, req.params.lessonId, score, timeSpent);
    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

const isLessonCompleted = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const completed = await progressService.isLessonCompleted(targetUserId, req.params.lessonId);
    res.json({ success: true, data: { completed } });
  } catch (err) {
    next(err);
  }
};

const getLessonScore = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const score = await progressService.getLessonScore(targetUserId, req.params.lessonId);
    res.json({ success: true, data: { score } });
  } catch (err) {
    next(err);
  }
};


const getLeaderboard = async (req, res, next) => {
  try {
    const limit = req.params.limit ? parseInt(req.params.limit, 10) : 10;
    const board = await progressService.getLeaderboard(limit);
    res.json({ success: true, data: board });
  } catch (err) {
    next(err);
  }
};


const resetUserProgress = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const ok = await progressService.resetUserProgress(targetUserId);
    res.json({ success: ok });
  } catch (err) {
    next(err);
  }
};

const getCategoryStats = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const stats = await progressService.getCategoryStats(targetUserId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProgress,
  createUserProgress,
  saveLessonCompletion,
  isLessonCompleted,
  getLessonScore,
  getLeaderboard,
  resetUserProgress,
  getCategoryStats
};
