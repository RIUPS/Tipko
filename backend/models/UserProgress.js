const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    default: 'Mladi raziskovalec'
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 1
    }
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  achievements: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    icon: {
      type: String,
      default: '🏆'
    }
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ totalPoints: -1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);