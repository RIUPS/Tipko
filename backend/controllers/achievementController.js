const UserProgress = require('../models/UserProgress');
const Achievement = require('../models/Achievement');
const { getUserIdPathParam } = require('../middleware/auth');

const getAllAchievements = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const progress = await UserProgress.findOne({ user: targetUserId }).populate('achievements.achievement').select('achievements');
    const achievements = (progress && progress.achievements) ? progress.achievements.map(a => ({
      _id: a._id,
      achievement: a.achievement,
      earnedAt: a.earnedAt,
      shown: !!a.shown
    })) : [];
    res.json({ success: true, data: achievements });
  } catch (err) {
    next(err);
  }
};

// Return unshown achievements and mark them as shown
const getUnshownAchievements = async (req, res, next) => {
  try {
    const targetUserId = getUserIdPathParam(req);
    const progress = await UserProgress.findOne({ user: targetUserId }).populate('achievements.achievement');

    if (!progress || !progress.achievements) {
      return res.json({ success: true, data: [] });
    }

    const unshown = progress.achievements.filter(a => !a.shown).map(a => ({
      _id: a._id,
      achievement: a.achievement,
      earnedAt: a.earnedAt
    }));

    // Mark them as shown and save
    let changed = false;
    progress.achievements.forEach(a => {
      if (!a.shown) {
        a.shown = true;
        changed = true;
      }
    });

    if (changed) await progress.save();

    res.json({ success: true, data: unshown });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAchievements,
  getUnshownAchievements
};
