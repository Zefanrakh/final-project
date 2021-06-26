const request = require('supertest');
const app = require('../app');

describe('Read Appointment | Success Case', ()=>{
    it('should send an object with array', done => {
        request(app)
            .get('/appointment')
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'read data success')
                expect(res.body).toHaveProperty('data', expect.any(Array))
                done()
            })
    })
})