const lessonService = require('../services/lessonService');

const getAllLessons = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;

    const lessons = await lessonService.getAllLessons(filters);
    res.json({ success: true, data: lessons });
  } catch (err) {
    next(err);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lekcija ni najdena' });
    res.json({ success: true, data: lesson });
  } catch (err) { next(err); }
};

const getLessonsByCategory = async (req, res, next) => {
  try {
    const lessons = await lessonService.getLessonsByCategory(req.params.category);
    res.json({ success: true, data: lessons });
  } catch (err) { next(err); }
};

const getLessonsByDifficulty = async (req, res, next) => {
  try {
    const lessons = await lessonService.getLessonsByDifficulty(req.params.difficulty);
    res.json({ success: true, data: lessons });
  } catch (err) { next(err); }
};

const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    res.status(201).json({ success: true, data: lesson });
  } catch (err) { next(err); }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.body);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lekcija ni najdena' });
    res.json({ success: true, data: lesson });
  } catch (err) { next(err); }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.deleteLesson(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lekcija ni najdena' });
    res.json({ success: true, data: lesson });
  } catch (err) { next(err); }
};

const bulkUpdateLessons = async (req, res, next) => {
  try {
    const result = await lessonService.bulkUpdateLessons(req.body.updates || []);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

module.exports = {
  getAllLessons,
  getLessonById,
  getLessonsByCategory,
  getLessonsByDifficulty,
  createLesson,
  updateLesson,
  deleteLesson,
  bulkUpdateLessons
};
