// Minimal smoke test - exercised by Jenkins in the 'Test' stage
const request = require('supertest');

// Force test env before app load
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
const app = require('../src/server');

describe('Health', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('GET /api/ready returns ready or 503', async () => {
    const res = await request(app).get('/api/ready');
    expect([200, 503]).toContain(res.statusCode);
  });
});
