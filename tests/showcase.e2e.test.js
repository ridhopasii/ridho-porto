const request = require('supertest');
const app = require('../src/app');

describe('GET /showcase', () => {
  it('responds with 200 and contains sections', async () => {
    const res = await request(app).get('/showcase');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Proyek/);
    expect(res.text).toMatch(/Sertifikat/);
    expect(res.text).toMatch(/Tech Stack/);
  });
});
