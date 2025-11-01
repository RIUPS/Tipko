const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const achievementsData = require('./achievements.json');
require('dotenv').config();

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Povezava z MongoDB uspešna (achievements)');

    await Achievement.deleteMany({});
    console.log('Stare nagrade (achievements) izbrisane');

    await Achievement.insertMany(achievementsData);
    console.log(`${achievementsData.length} achievements uspešno vnesenih`);

    process.exit(0);
  } catch (error) {
    console.error('Napaka pri vnosu achievements:', error);
    process.exit(1);
  }
};

seedAchievements();
