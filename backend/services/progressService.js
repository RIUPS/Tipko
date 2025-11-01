const UserProgress = require('../models/UserProgress');
const Lesson = require('../models/Lesson');
const Achievement = require('../models/Achievement');

/**
 * Pridobi napredek uporabnika
 * @param {String} userId - ID uporabnika
 * @returns {Promise<Object>} Uporabniški napredek
 */
const getUserProgress = async (userId) => {
  let progress = await UserProgress.findOne({ user: userId })
    .populate('completedLessons.lessonId', 'title category difficulty points icon')
    .lean();

  // Če uporabnik še nima napredka, ustvari nov zapis
  if (!progress) {
    progress = await UserProgress.create({ user: userId });
  }

  return progress;
};

/**
 * Ustvari nov napredek za uporabnika
 * @param {String} userId - ID uporabnika
 * @param {String} nickname - Opcijski vzdevek
 * @returns {Promise<Object>} Ustvarjen napredek
 */
const createUserProgress = async (userId, nickname = 'Mladi raziskovalec') => {
  const progress = await UserProgress.create({ user: userId, nickname });
  return progress;
};

/**
 * Shrani dokončano lekcijo
 * @param {String} userId - ID uporabnika
 * @param {String} lessonId - ID lekcije
 * @param {Number} score - Dosežen rezultat (0-100)
 * @param {Number} timeSpent - Čas v sekundah
 * @returns {Promise<Object>} Posodobljen napredek
 */
const saveLessonCompletion = async (userId, lessonId, score, timeSpent = 0) => {
  // Pridobi lekcijo za podatke o točkah in kategoriji
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) {
    throw new Error('Lekcija ne obstaja');
  }

  // Pridobi ali ustvari napredek
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) {
    progress = new UserProgress({ user: userId });
  }

  // Preveri, ali je lekcija že dokončana
  const existingLessonIndex = progress.completedLessons.findIndex(
    l => l.lessonId && l.lessonId.toString() === lessonId
  );

  if (existingLessonIndex !== -1) {
    // Lekcija že obstaja - posodobi rezultat, če je boljši
    const existingLesson = progress.completedLessons[existingLessonIndex];
    
    if (score > existingLesson.score) {
      // Odštej stare točke, dodaj nove
      const pointsDifference = score - existingLesson.score;
      progress.totalPoints += pointsDifference;
      
      existingLesson.score = score;
      existingLesson.attempts += 1;
      existingLesson.completedAt = new Date();
      existingLesson.timeSpent = timeSpent;
      existingLesson.isPerfect = (score === 100);
    } else {
      // Samo povečaj število poskusov
      existingLesson.attempts += 1;
    }
  } else {
    // Nova dokončana lekcija
    progress.completedLessons.push({
      lessonId,
      completedAt: new Date(),
      score,
      attempts: 1,
      timeSpent,
      isPerfect: (score === 100)
    });
    
    progress.totalPoints += score;
    
    // Posodobi statistiko po kategoriji
    const categoryKey = lesson.category;
    if (!progress.categoryStats[categoryKey]) {
      progress.categoryStats[categoryKey] = { completed: 0, points: 0 };
    }
    progress.categoryStats[categoryKey].completed += 1;
    progress.categoryStats[categoryKey].points += score;
  }

  // Posodobi aktivnost in streak - calculate based on previous lastActive
  const now = new Date();
  const lastActive = progress.lastActive ? new Date(progress.lastActive) : null;

  if (!lastActive) {
    // first activity
    progress.currentStreak = 1;
  } else {
    const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      // same day - no change
    } else if (hoursDiff < 48) {
      // next consecutive day
      progress.currentStreak = (progress.currentStreak || 0) + 1;
    } else {
      // streak broken
      progress.currentStreak = 1;
    }
  }

  if (!progress.longestStreak || progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  progress.lastActive = now;
  progress.totalAttempts = (progress.totalAttempts || 0) + 1;

  // Check achievements after updating progress values
  try {
    const achievements = await Achievement.find().lean();
    for (const ach of achievements) {
      const already = progress.achievements && progress.achievements.some(a => a.achievement && a.achievement.toString() === ach._id.toString());
      if (already) continue;

      const cond = ach.condition || {};
      let award = false;

      switch (cond.type) {
        case 'points':
          award = (progress.totalPoints >= (cond.value || 0));
          break;
        case 'lessons':
          award = (progress.completedLessons && progress.completedLessons.length >= (cond.value || 0));
          break;
        case 'streak':
          award = ((progress.currentStreak || 0) >= (cond.value || 0));
          break;
        case 'category':
          // require condition.category to be present
          if (cond.category) {
            const stats = progress.categoryStats && progress.categoryStats[cond.category];
            award = (stats && stats.completed >= (cond.value || 0));
          }
          break;
        default:
          break;
      }

      if (award) {
        progress.achievements = progress.achievements || [];
        progress.achievements.push({
          achievement: ach._id,
          earnedAt: new Date(),
          shown: false
        });
      }
    }
  } catch (err) {
    // Do not fail the whole flow if achievements lookup fails
    console.warn('Error checking achievements:', err.message || err);
  }

  await progress.save();

  return progress;
};

/**
 * Preveri, ali je lekcija dokončana
 * @param {String} userId - ID uporabnika
 * @param {String} lessonId - ID lekcije
 * @returns {Promise<Boolean>} True če je dokončana
 */
const isLessonCompleted = async (userId, lessonId) => {
  const progress = await UserProgress.findOne({ user: userId }).lean();
  
  if (!progress) return false;
  
  return progress.completedLessons.some(
    l => l.lessonId && l.lessonId.toString() === lessonId
  );
};

/**
 * Pridobi rezultat za lekcijo
 * @param {String} userId - ID uporabnika
 * @param {String} lessonId - ID lekcije
 * @returns {Promise<Number|null>} Rezultat ali null
 */
const getLessonScore = async (userId, lessonId) => {
  const progress = await UserProgress.findOne({ user: userId }).lean();
  
  if (!progress) return null;
  
  const lesson = progress.completedLessons.find(
    l => l.lessonId && l.lessonId.toString() === lessonId
  );
  
  return lesson ? lesson.score : null;
};

/**
 * Dodaj dosežek uporabniku
 * @param {String} userId - ID uporabnika
 * @param {Object} achievement - {name, description, icon}
 * @returns {Promise<Object>} Posodobljen napredek
 */
const addAchievement = async (userId, achievement) => {
  const progress = await UserProgress.findOne({ user: userId });

  if (!progress) {
    throw new Error('Uporabnik nima napredka');
  }

  // Support passing either an achievement id or object
  const achievementId = (typeof achievement === 'string' || achievement instanceof require('mongoose').Types.ObjectId)
    ? achievement
    : (achievement && achievement._id) ? achievement._id : null;

  if (!achievementId) {
    throw new Error('Invalid achievement identifier');
  }

  const exists = progress.achievements && progress.achievements.some(a => a.achievement && a.achievement.toString() === achievementId.toString());

  if (!exists) {
    progress.achievements = progress.achievements || [];
    progress.achievements.push({ achievement: achievementId, earnedAt: new Date(), shown: false });
    await progress.save();
  }

  return progress;
};

/**
 * Pridobi leaderboard (top uporabniki po točkah)
 * @param {Number} limit - Število uporabnikov
 * @returns {Promise<Array>} Array uporabnikov
 */
const getLeaderboard = async (limit = 10) => {
  const leaderboard = await UserProgress.find()
    .sort({ totalPoints: -1 })
    .limit(limit)
    .select('nickname totalPoints achievements currentStreak completedLessons')
    .lean();
  
  return leaderboard;
};

/**
 * Posodobi streak (zaporedne dni uporabe)
 * @param {String} userId - ID uporabnika
 * @returns {Promise<Object>} Posodobljen napredek
 */
// Keep a helper for explicit streak updates if needed internally
const updateStreak = async (userId) => {
  const progress = await UserProgress.findOne({ user: userId });
  
  if (!progress) {
    throw new Error('Uporabnik nima napredka');
  }

  const now = new Date();
  const lastActive = progress.lastActive ? new Date(progress.lastActive) : null;
  if (!lastActive) {
    progress.currentStreak = 1;
  } else {
    const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      // same day - nothing
    } else if (hoursDiff < 48) {
      progress.currentStreak = (progress.currentStreak || 0) + 1;
    } else {
      progress.currentStreak = 1;
    }
  }

  if (!progress.longestStreak || progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  progress.lastActive = now;
  await progress.save();
  
  return progress;
};

/**
 * Ponastavi napredek uporabnika
 * @param {String} userId - ID uporabnika
 * @returns {Promise<Boolean>} True če uspešno
 */
const resetUserProgress = async (userId) => {
  const result = await UserProgress.findOneAndDelete({ user: userId });
  return !!result;
};

/**
 * Pridobi statistiko po kategorijah za uporabnika
 * @param {String} userId - ID uporabnika
 * @returns {Promise<Object>} Statistika
 */
const getCategoryStats = async (userId) => {
  const progress = await UserProgress.findOne({ user: userId })
    .select('categoryStats')
    .lean();
  
  return progress ? progress.categoryStats : null;
};

/**
 * Preštej dokončane lekcije
 * @param {String} userId - ID uporabnika
 * @returns {Promise<Number>} Število dokončanih lekcij
 */
const countCompletedLessons = async (userId) => {
  const progress = await UserProgress.findOne({ user: userId })
    .select('completedLessons')
    .lean();
  
  return progress ? progress.completedLessons.length : 0;
};

module.exports = {
  getUserProgress,
  createUserProgress,
  saveLessonCompletion,
  isLessonCompleted,
  getLessonScore,
  addAchievement,
  getLeaderboard,
  updateStreak,
  resetUserProgress,
  getCategoryStats,
  countCompletedLessons
};