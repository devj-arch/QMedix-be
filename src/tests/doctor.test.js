import request from 'supertest';
import app from '../app.js';

describe('Doctor Availability Toggle - WhiteBox', () => {

  let cookies;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login/doctor')
      .send({
        email: 'doctor@test.com',
        password: 'QMedix@123'
      });

    cookies = res.headers['set-cookie']; 
  });

  test('Toggle availability should succeed (doctor only)', async () => {
    const res = await request(app)
      .post('/doctor/toggle-availability')
      .set('Cookie', cookies); 

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Doctor Availability toggled.");
  });

  test('Toggle availability WITHOUT login should fail', async () => {
    const res = await request(app)
      .post('/doctor/toggle-availability');

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});