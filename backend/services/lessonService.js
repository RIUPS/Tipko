const Lesson = require('../models/Lesson');

/**
 * Pridobi vse aktivne lekcije, sortirane po vrstnem redu
 * @param {Object} filters - Opcijski filtri (category, difficulty)
 * @returns {Promise<Array>} Array lekcij
 */
const getAllLessons = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  
  const lessons = await Lesson.find(query)
    .sort({ order: 1 })
    .lean(); // .lean() vrne plain JS objekte (hitrejše)
  
  return lessons;
};

/**
 * Pridobi eno lekcijo po ID
 * @param {String} lessonId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Lekcija ali null
 */
const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();
  return lesson;
};

/**
 * Pridobi lekcije po kategoriji
 * @param {String} category - Kategorija (miška, tipkovnica, ...)
 * @returns {Promise<Array>} Array lekcij
 */
const getLessonsByCategory = async (category) => {
  const lessons = await Lesson.find({ 
    category, 
    isActive: true 
  })
    .sort({ order: 1 })
    .lean();
  
  return lessons;
};

/**
 * Pridobi lekcije po težavnosti
 * @param {String} difficulty - Težavnost (začetnik, srednji, napredni)
 * @returns {Promise<Array>} Array lekcij
 */
const getLessonsByDifficulty = async (difficulty) => {
  const lessons = await Lesson.find({ 
    difficulty, 
    isActive: true 
  })
    .sort({ order: 1 })
    .lean();
  
  return lessons;
};

/**
 * Ustvari novo lekcijo
 * @param {Object} lessonData - Podatki za novo lekcijo
 * @returns {Promise<Object>} Ustvarjena lekcija
 */
const createLesson = async (lessonData) => {
  const lesson = await Lesson.create(lessonData);
  return lesson;
};

/**
 * Posodobi obstoječo lekcijo
 * @param {String} lessonId - MongoDB ObjectId
 * @param {Object} updateData - Podatki za posodobitev
 * @returns {Promise<Object|null>} Posodobljena lekcija ali null
 */
const updateLesson = async (lessonId, updateData) => {
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    updateData,
    {
      new: true,           // Vrne posodobljen dokument
      runValidators: true  // Požene Mongoose validacijo
    }
  );
  
  return lesson;
};

/**
 * Izbriši lekcijo
 * @param {String} lessonId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Izbrisana lekcija ali null
 */
const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);
  return lesson;
};

/**
 * Preštej vse lekcije po kategoriji
 * @param {String} category - Kategorija
 * @returns {Promise<Number>} Število lekcij
 */
const countLessonsByCategory = async (category) => {
  const count = await Lesson.countDocuments({ 
    category, 
    isActive: true 
  });
  
  return count;
};

/**
 * Preveri, ali lekcija obstaja
 * @param {String} lessonId - MongoDB ObjectId
 * @returns {Promise<Boolean>} True če obstaja
 */
const lessonExists = async (lessonId) => {
  const exists = await Lesson.exists({ _id: lessonId });
  return !!exists;
};

/**
 * Pridobi naslednji available order number
 * @returns {Promise<Number>} Naslednji order number
 */
const getNextOrderNumber = async () => {
  const lastLesson = await Lesson.findOne()
    .sort({ order: -1 })
    .select('order')
    .lean();
  
  return lastLesson ? lastLesson.order + 1 : 1;
};

/**
 * Bulk update - posodobi več lekcij naenkrat
 * @param {Array} updates - Array objektov [{id, data}, ...]
 * @returns {Promise<Object>} Rezultat operacije
 */
const bulkUpdateLessons = async (updates) => {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { _id: update.id },
      update: { $set: update.data }
    }
  }));
  
  const result = await Lesson.bulkWrite(bulkOps);
  return result;
};

module.exports = {
  getAllLessons,
  getLessonById,
  getLessonsByCategory,
  getLessonsByDifficulty,
  createLesson,
  updateLesson,
  deleteLesson,
  countLessonsByCategory,
  lessonExists,
  getNextOrderNumber,
  bulkUpdateLessons
};