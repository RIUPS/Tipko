const request = require('supertest');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Achievement = require('../models/Achievement');
const UserProgress = require('../models/UserProgress');
const { initApp, stop } = require('./helpers');
const authService = require('../services/authService');

describe('Progress API', () => {
  let app;
  let user;
  let token;
  let lesson;

  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
    // create a normal user
    user = await User.create({ email: 'prog@example.com', password: 'pass123', name: 'Prog' });
    token = authService.generateToken(user);
    // create a lesson to use
    lesson = await Lesson.create({
      title: 'Prog Lesson',
      description: 'desc',
      content: { blocks: [] },
      category: 'miška',
      difficulty: 'začetnik',
      order: 1
    });
  });

  afterAll(async () => {
    await stop();
  });

  test('POST /api/progress/:userId/complete/:lessonId saves completion and updates progress', async () => {
    const res = await request(app)
      .post(`/api/progress/self/complete/${lesson._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 80, timeSpent: 30 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.totalPoints).toBeGreaterThanOrEqual(80);
  });

  test('GET /api/progress/:userId returns user progress', async () => {
    const res = await request(app).get(`/api/progress/self`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('completedLessons');
  });

  test('GET /api/progress/:userId/score/:lessonId returns score', async () => {
    const res = await request(app).get(`/api/progress/self/score/${lesson._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.score).toBe('number');
  });

  test('GET /api/progress/:userId/completed/:lessonId returns completed flag', async () => {
    const res = await request(app).get(`/api/progress/self/completed/${lesson._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.completed).toBe('boolean');
    expect(res.body.data.completed).toBe(true);
  });

  test('GET /api/progress/:userId/stats/categories returns category stats', async () => {
    const res = await request(app).get(`/api/progress/self/stats/categories`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('miška');
  });

  test('GET /api/progress/leaderboard/top returns leaderboard', async () => {
    const res = await request(app).get('/api/progress/leaderboard/top').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/progress/:userId/reset (admin) resets progress', async () => {
    // create admin
    const admin = await User.create({ email: 'adm@ex', password: 'admin', role: 'admin' });
    const adminToken = authService.generateToken(admin);

    const res = await request(app).post(`/api/progress/${user._id}/reset`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(res.body.success).toBe(true);
  });
});
