const lessonService = require('../services/lessonService');
const adminService = require('../services/adminService');

const getAllLessonsAdmin = async (req, res, next) => {
  try {
    // Get all lessons including isActive false
    const lessons = await lessonService.getAllLessons({});
    res.json({ success: true, data: lessons });
  } catch (err) { next(err); }
};

const runBackup = async (req, res, next) => {
  try {
    const result = await adminService.runBackup();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const deleteLessonAdmin = async (req, res, next) => {
  try {
    const lesson = await lessonService.deleteLesson(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lekcija ni najdena' });
    res.json({ success: true, data: lesson });
  } catch (err) { next(err); }
};

module.exports = {
  getAllLessonsAdmin,
  runBackup,
  deleteLessonAdmin
};
