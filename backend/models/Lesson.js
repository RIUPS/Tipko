const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Naslov lekcije je obvezen'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['miška', 'tipkovnica', 'bližnjice', 'splet', 'mini-igre']
  },
  difficulty: {
    type: String,
    enum: ['začetnik', 'srednji', 'napredni'],
    default: 'začetnik'
  },
  description: {
    type: String,
    required: true
  },
  instructions: [String],
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  points: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  order: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: '🎮'
  }
}, {
  timestamps: true
});

lessonSchema.index({ category: 1, difficulty: 1 });
lessonSchema.index({ order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);