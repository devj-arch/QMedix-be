import request from 'supertest';
import app from '../../app.js';

describe('Auth API - Black Box', () => {

  test('Login success (Patient)', async () => {
    const res = await request(app)
      .post('/auth/login/patient')
      .send({
        email: 'patient@test.com',
        password: 'QMedix@123'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login failure (Patient)', async () => {
    const res = await request(app)
      .post('/auth/login/patient')
      .send({
        email: 'patient@gmail.com'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

    test('Login success (Doctor)', async () => {
    const res = await request(app)
      .post('/auth/login/doctor')
      .send({
        email: 'doctor@test.com',
        password: 'QMedix@123'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login failure (Doctor)', async () => {
    const res = await request(app)
      .post('/auth/login/doctor')
      .send({
        email: 'test@gmail.com'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('Login success (Staff)', async () => {
    const res = await request(app)
      .post('/auth/login/hospital-staff')
      .send({
        email: 'staff@test.com',
        password: 'QMedix@123'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login failure (Staff)', async () => {
    const res = await request(app)
      .post('/auth/login/hospital-staff')
      .send({
        email: 'test@gmail.com'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

    test('Login success (Admin)', async () => {
    const res = await request(app)
      .post('/auth/login/hospital')
      .send({
        email: 'admin@test.com',
        password: 'QMedix@123'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login failure (Admin)', async () => {
    const res = await request(app)
      .post('/auth/login/hospital')
      .send({
        email: 'test@gmail.com'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});