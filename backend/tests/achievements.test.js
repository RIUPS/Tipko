const request = require('supertest');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Achievement = require('../models/Achievement');
const { initApp, stop } = require('./helpers');
const authService = require('../services/authService');

describe('Achievements API', () => {
  let app, user, token, lesson;

  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
    user = await User.create({ email: 'ach@example.com', password: 'pass', name: 'Ach' });
    token = authService.generateToken(user);
    // create lesson
    lesson = await Lesson.create({ title: 'A', description: 'd', content: {}, category: 'miška', difficulty: 'začetnik', order: 2 });
  });

  afterAll(async () => {
    await stop();
  });

  test('unshown achievements flow: create achievement, trigger via completion, fetch unshown then shown', async () => {
    // create an achievement that requires 1 lesson completed
    const ach = await Achievement.create({ name: 'First', description: 'First lesson', condition: { type: 'lessons', value: 1 }, rarity: 'common' });

    // complete lesson
    await request(app).post(`/api/progress/self/complete/${lesson._id}`).set('Authorization', `Bearer ${token}`).send({ score: 50 }).expect(200);

    // get unshown achievements
    const unshown = await request(app).get(`/api/achievements/unshown/self`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(unshown.body.success).toBe(true);
    expect(Array.isArray(unshown.body.data)).toBe(true);
    expect(unshown.body.data.length).toBeGreaterThanOrEqual(1);

    // subsequent call should return empty (they are marked shown)
    const unshown2 = await request(app).get(`/api/achievements/unshown/self`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(unshown2.body.data.length).toBe(0);
  });
});
