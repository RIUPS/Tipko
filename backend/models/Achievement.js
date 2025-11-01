const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  condition: {
    type: {
      type: String,
      enum: ['points', 'lessons', 'streak', 'category'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
    ,
    // Optional category key for 'category' condition
    category: {
      type: String
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);