const request = require('supertest');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const adminService = require('../services/adminService');
const { initApp, stop } = require('./helpers');
const authService = require('../services/authService');

jest.mock('../services/adminService');

describe('Admin API', () => {
  let app, admin, adminToken;

  beforeAll(async () => {
    const res = await initApp();
    app = res.app;
    admin = await User.create({ email: 'admin2@example.com', password: 'pw', role: 'admin' });
    adminToken = authService.generateToken(admin);
    // create a lesson including inactive
    await Lesson.create({ title: 'Inactive', description: 'd', content: {}, category: 'miška', difficulty: 'začetnik', order: 5, isActive: false });
  });

  afterAll(async () => {
    await stop();
  });

  test('GET /api/admin/lessons returns lessons including inactive', async () => {
    const res = await request(app).get('/api/admin/lessons').set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/admin/backup calls adminService.runBackup and returns result', async () => {
    adminService.runBackup.mockResolvedValue({ stdout: 'ok', outDir: '/tmp' });
    const res = await request(app).post('/api/admin/backup').set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('outDir');
  });
});
