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

describe('Read Search | Success Case', ()=>{
    it('type appointment', done => {
        request(app)
            .get('/search?searchType=appointment&keyword=tes')
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('result', expect.any(Array))
                done()
            })
    })
})

describe('Read Search | Success Case', ()=>{
    it('type customer', done => {
        request(app)
            .get('/search?searchType=customers&keyword=tes')
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('result', expect.any(Array))
                done()
            })
    })
})

describe('Read Search | Success Case', ()=>{
    it('type present-list', done => {
        request(app)
            .get('/search?searchType=present-list&keyword=tes')
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('result', expect.any(Array))
                done()
            })
    })
})

describe('Read Search | failed Case', ()=>{
    it('type present-list', done => {
        request(app)
            .get('/search?searchType=gakada')
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty("message", "wrong searchType")
                done()
            })
    })
})