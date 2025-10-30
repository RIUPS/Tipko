const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const lessonsData = require('./lessons.json');
require('dotenv').config();

const seedLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Povezava z MongoDB uspešna');

    await Lesson.deleteMany({});
    console.log('Stare lekcije izbrisane');

    await Lesson.insertMany(lessonsData);
    console.log(`${lessonsData.length} lekcij uspešno vnesenih`);

    process.exit(0);
  } catch (error) {
    console.error('Napaka:', error);
    process.exit(1);
  }
};

seedLessons();