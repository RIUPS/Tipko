const request = require('supertest');
const User = require('../models/User');
const { initApp, stop } = require('./helpers');

describe('Auth API', () => {
  let app;
  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
  });

  afterAll(async () => {
    await stop();
  });

  test('POST /api/auth/register registers a new user and returns token', async () => {
    const payload = { email: 'test@example.com', password: 'secret123', name: 'Tester' };
    const res = await request(app).post('/api/auth/register').send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(payload.email);
  });

  test('POST /api/auth/login returns token for existing user', async () => {
    const payload = { email: 'login@example.com', password: 'loginpass', name: 'Login' };
    // create user directly
    await User.create(payload);
    const res = await request(app).post('/api/auth/login').send({ email: payload.email, password: payload.password }).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });
});
