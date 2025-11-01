const request = require('supertest');
const { initApp, stop } = require('./helpers');

describe('Auth middleware and role checks', () => {
  let app;

  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
  });

  afterAll(async () => {
    await stop();
  });

  test('Protected endpoints without token return 401', async () => {
    await request(app).get('/api/progress/self').expect(401);
    await request(app).post('/api/lessons').send({}).expect(401);
  });
});
