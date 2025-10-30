const connectDB = require('../config/db');
const lessonService = require('../services/lessonService');
const progressService = require('../services/progressService');

// Test script
const testServices = async () => {
  try {
    // Poveži z bazo
    await connectDB();
    
    console.log('Testiram Lesson Service...\n');
    
    // Test: Pridobi vse lekcije
    const lessons = await lessonService.getAllLessons();
    console.log(`Pridobljenih ${lessons.length} lekcij`);
    
    // Test: Pridobi lekcije po kategoriji
    const mouseLessons = await lessonService.getLessonsByCategory('miška');
    console.log(`${mouseLessons.length} lekcij v kategoriji 'miška'`);
    
    console.log('\nTestiram Progress Service...\n');
    
    // Test: Ustvari napredek
    const userId = 'test-user-123';
    const progress = await progressService.getUserProgress(userId);
    console.log(`Napredek uporabnika: ${progress.nickname}`);
    
    // Test: Shrani dokončano lekcijo (če obstaja)
    if (lessons.length > 0) {
      const updated = await progressService.saveLessonCompletion(
        userId,
        lessons[0]._id.toString(),
        85,
        120
      );
      console.log(`Lekcija shranjena. Skupaj točk: ${updated.totalPoints}`);
    }
    
    console.log('\nVsi testi uspešni!');
    process.exit(0);
    
  } catch (error) {
    console.error('Napaka pri testiranju:', error.message);
    process.exit(1);
  }
};

testServices();