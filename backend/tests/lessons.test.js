const request = require('supertest');
const User = require('../models/User');
const { initApp, stop } = require('./helpers');
const authService = require('../services/authService');

describe('Lessons API', () => {
  let app;
  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
  });

  afterAll(async () => {
    await stop();
  });

  test('GET /api/lessons returns array', async () => {
    const res = await request(app).get('/api/lessons').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/lessons (admin) can create a lesson', async () => {
    // create admin user directly
    const admin = await User.create({ email: 'admin@test', password: 'adminpass', role: 'admin' });
    const token = authService.generateToken(admin);

    const payload = {
      title: 'Test Lesson',
      description: 'A simple test lesson',
      content: { blocks: [] },
      category: 'miška',
      difficulty: 'začetnik',
      order: 999
    };
    const res = await request(app).post('/api/lessons').set('Authorization', `Bearer ${token}`).send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
  });
});
