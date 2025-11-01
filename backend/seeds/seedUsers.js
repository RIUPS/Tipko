const mongoose = require('mongoose');
const User = require('../models/User');
const usersData = require('./users.json');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Povezava z MongoDB uspešna (users)');

    await User.deleteMany({});
    console.log('Stari uporabniki izbrisani');

    // Use model instances so pre-save hook hashes passwords
    const created = await Promise.all(usersData.map(u => new User(u).save()));
    console.log(`${created.length} uporabnikov uspešno vnesenih`);

    process.exit(0);
  } catch (error) {
    console.error('Napaka pri vnosu uporabnikov:', error);
    process.exit(1);
  }
};

seedUsers();
