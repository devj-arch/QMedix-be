import request from 'supertest';
import app from '../../app.js';

// let token;

// beforeAll(async () => {
//   const res = await request(app)
//     .post('/auth/login/patient')
//     .send({
//       email: 'patient@test.com',
//       password: 'QMedix@123'
//     });

//   token = res.session.access_token; 
// });


describe ('Appointment API - BlackBox',()=>{
    test('Book appointment WITHOUT login should fail', async () => {
        const today = new Date().toISOString().split('T')[0];
        const hours = Math.floor(Math.random() * 8) + 9; 
        const minutes = Math.random() < 0.5 ? '00' : '30';
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours > 12 ? hours - 12 : hours;
        const timeSlot = `${formattedHour}:${minutes} ${meridiem}`;

        const res = await request(app)
            .post('/patient/book-appointment')
            .send({
            pref_doctor: "b3c1e2a4-1234-4abc-9d12-abcdef123456",
            hospital_id: "ec19a666-7597-434c-9cf8-26e59b74c269",
            department: "Cardiology",
            bookingDate: today,
            timeSlot: timeSlot,
            isEmergency: false
            });

        expect(res.statusCode).toBeGreaterThanOrEqual(401);
    });

    // test('Book appointment WITH login should succeed', async () => {
    //     const tomorrow = new Date();
    //     tomorrow.setDate(tomorrow.getDate() + 1);
    //     const bookingDate = tomorrow.toISOString().split('T')[0];
    //     const hours = Math.floor(Math.random() * 8) + 9;
    //     const minutes = Math.random() < 0.5 ? '00' : '30';

    //     const meridiem = hours >= 12 ? 'PM' : 'AM';
    //     const formattedHour = hours > 12 ? hours - 12 : hours;

    //     const timeSlot = `${formattedHour}:${minutes} ${meridiem}`;

    //     const res = await request(app)
    //         .post('/patient/book-appointment')
    //         .set('Authorization', `Bearer ${token}`) // 👈 important
    //         .send({
    //         pref_doctor: "b3c1e2a4-1234-4abc-9d12-abcdef123456",
    //         hospital_id: "830b30cf-4ac3-4153-a156-2adbab8f5a48",
    //         department: "General",
    //         bookingDate,
    //         timeSlot,
    //         isEmergency: false
    //         });

    //     expect([200, 201]).toContain(res.statusCode);
    // });
})

