const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB povezana: ${conn.connection.host}`);
    console.log(`Baza: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ Napaka pri povezavi: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;