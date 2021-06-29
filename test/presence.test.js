const request = require('supertest');
const app = require('../app');
const { Customer, Appointment, PresenceList } = require('../models')

let CustomerId
let appointmentId
let PresenceListId

beforeAll( done=>{
    Customer.create({
        name: 'Solihin',
        email: 'test@email.com',
        address: 'Bandung',
        phoneNumber: '081320225578'
    })
        .then( customer => {
            CustomerId = customer.id
            return Appointment.create({
                CustomerId: customer.id,
                childName: "desi ratna sari", 
                childAge: 1, 
                startDate: "2021-08-01", 
                endDate: "2021-08-02", 
                status: "sudah bayar", 
                PriceId: 1, 
                quantity: 2, 
                note: "anak saya suka tidur siang agak lama",
                total: 400000
            })
        })
        .then( appointment => {
            appointmentId = appointment.id
            return PresenceList.create({
                dropperName: "dede suhardi",
                pickupperName: "dede suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-01",
                AppointmentId: appointmentId
            })
        })
        .then(presenceList => {
            PresenceListId = presenceList.id
            done()
        })
        .catch(err => {done(err)})
})
let tempData = {
    dropperName: "dadang suhardi",
    pickupperName: "dadang suhardi",
    pickupTime: "17:00",
    presenceDate: "2021-09-01",
    AppointmentId: appointmentId
}
afterAll(done => {
    Appointment.destroy({truncate: { cascade: true }})
        .then(_=> {
            return Customer.destroy({truncate: { cascade: true }})
        })
        .then(_=> { return PresenceList.destroy({truncate: { cascade: true }}) 
        })
        .then(_=> {
            done()
        })
        .catch(err => {done(err)})
})

describe('Read presence | Success Case', ()=>{
    it('should send an object with array', done => {
        request(app)
            .get('/presence')
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res).toHaveProperty('body', expect.any(Array))
                done()
            })
    })
})

describe('Create Presence | Success Case', ()=>{
    it('should send an object with key: data', done => {
        request(app)
            .post('/presence')
            .send(tempData)
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('dropperName', expect.any(String))
                expect(res.body).toHaveProperty('pickupperName', expect.any(String))
                done()
            })
    })
})

describe('Create Presence | dropperName not send to server', ()=>{
    it('should send a message inside array Dropper name can not null', done => {
        request(app)
            .post('/presence')
            .send({
                //dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-01",
                AppointmentId: appointmentId
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['Dropper name can not null'])
                done()
            })
    })
})

describe('Create Presence | dropperName not filed', ()=>{
    it('should send a message inside array Dropper name can not be empty ', done => {
        request(app)
            .post('/presence')
            .send({
                dropperName: "",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-01",
                AppointmentId: appointmentId
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['Dropper name can not be empty'])
                done()
            })
    })
})

describe('Create presence | input presenceDate date before', ()=>{
    it.only('should send a message inside array presenceDate must be equal or greater than today', done => {
        request(app)
            .post('/presence')
            .send({
                dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2020-06-01",
                AppointmentId: appointmentId
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['presenceDate must be equal or greater than today'])
                done()
            })
    })
})