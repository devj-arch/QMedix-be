import request from 'supertest';
import app from '../app.js';

describe('Doctor Availability Toggle - WhiteBox', () => {

  let cookies;
  let initialAvailability; // track state so afterAll can restore it

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login/doctor')
      .send({ email: 'doctor@test.com', password: 'QMedix@123' });

    cookies = res.headers['set-cookie'];

    // Capture the doctor's availability before the test runs
    // so we can restore it afterward and avoid dirty state.
    const profileRes = await request(app)
      .get('/doctor/profile')
      .set('Cookie', cookies);

    if (profileRes.statusCode === 200) {
      initialAvailability = profileRes.body.isAvailable ?? profileRes.body.available;
    }
  });

  // Restore availability to whatever it was before the test ran.
  // Without this, every test run permanently flips the doctor's availability.
  afterAll(async () => {
    if (initialAvailability !== undefined && cookies) {
      const currentRes = await request(app)
        .get('/doctor/profile')
        .set('Cookie', cookies);

      const currentAvailability = currentRes.body.isAvailable ?? currentRes.body.available;

      // If state has changed, toggle it back
      if (currentAvailability !== initialAvailability) {
        await request(app)
          .post('/doctor/toggle-availability')
          .set('Cookie', cookies);
      }
    }
  });

  test('Toggle availability should succeed (doctor only)', async () => {
    const res = await request(app)
      .post('/doctor/toggle-availability')
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Doctor Availability toggled.');
  });

  test('Toggle availability WITHOUT login should fail', async () => {
    const res = await request(app)
      .post('/doctor/toggle-availability');

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});
