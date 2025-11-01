const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    // Whether the client has shown this achievement notification to the user
    shown: {
      type: Boolean,
      default: false
    }
  }],
  // Map of category stats: { <category>: { completed: Number, points: Number } }
  categoryStats: {
    type: Object,
    default: {}
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
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

module.exports = mongoose.model('UserProgress', userProgressSchema);