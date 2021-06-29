const request = require('supertest');
const app = require('../app');
const { Customer, Appointment, User } = require('../models')
const {sign, verify} = require('../helpers/jwt')
const PRIVATE_KEY = process.env.JWT_SECRET
let adminToken = ''
let customerToken = ''

let CustomerId
let appointmentId

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
            email: 'test2@email.com',
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
        done()
    })
    .catch(err => {done(err)})
})
let tempData = {
    CustomerId: CustomerId,
    childName: "Roni Disco", 
    childAge: 1, 
    startDate: "2021-08-01", 
    endDate: "2021-08-02", 
    status: "sudah bayar", 
    childCategory: "toddler",
    packageCategory: "daily",
    quantity: 2, 
    note: "anak saya suka makan siang agak lama",
    total: 400000
}
afterAll(done => {
    Appointment.destroy({truncate: { cascade: true }})
        .then(_=> {
            return Customer.destroy({truncate: { cascade: true }})
        })
        .then(_=> {
            return User.destroy({truncate: { cascade: true }})
        })
        .then(_=> { done() })
        .catch(err => {done(err)})
})

describe('Read Appointment | Success Case', ()=>{
    it('should send an object with array', done => {
        request(app)
            .get('/appointment')
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message', 'read data success')
                expect(res.body).toHaveProperty('data', expect.any(Array))
                done()
            })
    })
})

describe('Create Appointment | Success Case', ()=>{
    it('should send an object with key: data', done => {
        request(app)
            .post('/appointment')
            .send(tempData)
            .set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('childName', expect.any(String))
                expect(res.body).toHaveProperty('note', expect.any(String))
                done()
            })
    })
})

describe('Create Appointment | childName not send to server', ()=>{
    it('should send a message inside array Child name can not null ', done => {
        request(app)
            .post('/appointment')
            .set('access_token', adminToken)
            .send({
                CustomerId: CustomerId,
                //childName: "Roni Disco", 
                childAge: 1, 
                startDate: "2021-08-01", 
                endDate: "2021-08-02", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['Child name can not null'])
                done()
            })
    })
})

describe('Create Appointment | childName not filed', ()=>{
    it('should send a message inside array Child name can not be empty ', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 1, 
                childName: "",
                startDate: "2021-08-01", 
                endDate: "2021-08-02", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['Child name can not be empty'])
                done()
            })
    })
})

describe('Create Appointment | input start date before', ()=>{
    it('should send a message inside array start date mus be equal or greater than today', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 1, 
                childName: "somantri",
                startDate: "2021-06-01", 
                endDate: "2021-08-02", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['start date mus be equal or greater than today'])
                done()
            })
    })
})

describe('Create Appointment | input date with number', ()=>{
    it('should send a message inside array start date mus be equal or greater than today', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 1, 
                childName: "somantri",
                startDate: "", 
                endDate: "2021-08-02", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ["startDate can not be empty","start date format must be date","start date mus be equal or greater than today"])
                done()
            })
    })
})

describe('Create Appointment | input end date before today', ()=>{
    it('should send a message inside array end date mus be equal or greater than today', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 1, 
                childName: "somantri",
                startDate: "2021-08-01", 
                endDate: "2021-06-02", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ['End date mus be equal or greater than today'])
                done()
            })
    })
})

describe('Create Appointment | input end date with number', ()=>{
    it('should send a error message inside array', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 1, 
                childName: "somantri",
                startDate: "2021-08-02", 
                endDate: "", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ["End Date can not be empty","End Date format must be date","End date mus be equal or greater than today"])
                done()
            })
    })
})

describe('Create Appointment | input age with no falid number', ()=>{
    it('should send a error message inside array', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: -4, 
                childName: "somantri",
                startDate: "2021-08-02", 
                endDate: "2021-08-03", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ["Age must be filed with number 0 to 4"])
                done()
            })
    })

    it('should send a error message inside array', done => {
        request(app)
            .post('/appointment')
            .send({
                CustomerId: CustomerId,
                childAge: 6, 
                childName: "somantri",
                startDate: "2021-08-02", 
                endDate: "2021-08-03", 
                status: "sudah bayar", 
                childCategory: "toddler",
                packageCategory: "daily",
                quantity: 2, 
                note: "anak saya suka makan siang agak lama",
                total: 400000
            })
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('message', ["Age must be filed with number 0 to 4"])
                done()
            })
    })
})

describe('Read Appointment By Customer Id | Success Case', ()=>{
    it('should send an object with array', done => {
        request(app)
            .get('/appointment/customer/'+CustomerId)
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res).toHaveProperty('body', expect.any(Array))
                done()
            })
    })
})

describe('Read Appointment By Customer Id | faild Case', ()=>{
    it('should send an object with message', done => {
        request(app)
            .get('/appointment/customer/55')
            //.set('access_token', adminToken)
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(404)
                expect(res.body).toHaveProperty('message', 'data not found')
                done()
            })
    })
})

describe('update Appointment status | Success Case', ()=>{
    it('should send an object with message', done => {
        request(app)
            .patch('/appointment/'+appointmentId)
            //.set('access_token', adminToken)
            .send({ status: "sudah bayar"})
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(200)
                expect(res).toHaveProperty('body', expect.any(Array))
                done()
            })
    })
})

describe('update Appointment status | failed Case', ()=>{
    it('should send an object with message', done => {
        request(app)
            .patch('/appointment/10')
            //.set('access_token', adminToken)
            .send({ status: "sudah bayar"})
            .end((err, res)=>{
                if(err) return done(err)
                expect(res.status).toBe(404)
                expect(res.body).toHaveProperty('message', 'Data not found')
                done()
            })
    })
})