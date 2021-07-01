const request = require('supertest');
const app = require('../app');
const { Customer, Appointment, User, PresenceList } = require('../models')
const {sign, verify} = require('../helpers/jwt')
const PRIVATE_KEY = process.env.JWT_SECRET
let adminToken = ''
let customerToken = ''
let CustomerId
let appointmentId
let PresenceListId

beforeAll( done=>{
    User.create({
        username: "test",
        password: "1234567",
        role: "admin",
        profilePicture: "testes"
    })
    .then( user => {
        adminToken = sign ({id: user.id, username: user.username, role: user.role})
        return User.create({
            username: "test2",
            password: "1234567",
            role: "customer",
            profilePicture: "testes"
        })
    })
    .then( user => {
        customerToken = sign ({id: user.id, username: user.username, role: user.role})
        return Customer.create({
        name: 'Solihin',
        email: 'test@email.com',
        address: 'Bandung',
        phoneNumber: '081320225578',
        UserId: user.id 
        })
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
            return User.destroy({truncate: { cascade: true }})
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
            .set('access_token', adminToken)
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
            .send({
                dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-03",
                AppointmentId: appointmentId
            })
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(201)
                expect(res.body.insertedData).toHaveProperty('id', expect.any(Number))
                expect(res.body.insertedData).toHaveProperty('dropperName', expect.any(String))
                expect(res.body.insertedData).toHaveProperty('pickupperName', expect.any(String))
                expect(res.body).toHaveProperty('token', expect.any(String))
                done()
            })
    })
})

describe('Create Presence | failed Case', ()=>{
    it('should send an object with message', done => {
        request(app)
            .post('/presence')
            .send({
                dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-03",
                AppointmentId: appointmentId
            })
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', 'Sudah absen untuk hari ini')
                done()
            })
    })
})

describe('Create Presence | dropperName not send to server', ()=>{
    it('should send a message inside array Dropper name can not null', done => {
        request(app)
            .post('/presence')
            .set('access_token', adminToken)
            .send({
                //dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-02",
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
            .set('access_token', adminToken)
            .send({
                dropperName: "",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "2021-09-02",
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

describe('Create presence | input presenceDate invalid format', ()=>{
    it('should send a message', done => {
        request(app)
            .post('/presence')
            .set('access_token', adminToken)
            .send({
                dropperName: "dadang suhardi",
                pickupperName: "dadang suhardi",
                pickupTime: "17:00",
                presenceDate: "tes satu dua",
                AppointmentId: appointmentId
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', 'presenceDate format must be date')
                done()
            })
    })
})