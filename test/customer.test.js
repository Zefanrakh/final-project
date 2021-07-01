const request = require('supertest')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const app = require('../app')
const { Customer, Appointment, User } = require('../models')
const {sign, verify} = require('../helpers/jwt')
const PRIVATE_KEY = process.env.JWT_SECRET
let adminToken = ''
let customerToken = ''

let CustomerId

beforeAll((done)=>{
  // createAdmin()
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
      done()
  })
  .catch(err => {done(err)})
})

afterAll((done)=>{
  Customer.destroy({truncate: { cascade: true }})
  .then(_=> {
      return User.destroy({truncate: { cascade: true }})
  })
  .then(_=> { done() })
  .catch(err => {done(err)})
})

describe ('Read / Customer', function(){
  it('Success Get All Customer, code:200', function(done){
      request (app)
      .get(`/customers`)
      .set('access_token', adminToken)
      .then(response=>{
          let {status, body} = response
          expect(status).toBe(200)
          done()
      }).catch(err=>{ 
          done(err)
      })
  })

  it('fail Get All Customer, code:403', function(done){
    request (app)
    .get(`/customers`)
    .then(response=>{
        let {status, body} = response
        expect(status).toBe(403)
        done()
    }).catch(err=>{ 
        done(err)
    })
  })
})

describe('Post / Customer', function() {
  it('Success Create Customer with Code:201', function(done) {
    request(app)
      .post('/customers')
      .set('access_token', adminToken)
      .expect('Content-Type', /json/)
      .send({
        name:'Samuel',
        address:"Jl.Patimura,No 3",
        email:"samuel@aol.com",
        phoneNumber:"081237261153"
      })
      .then(response => {
        let{status,body} = response
          expect(status).toBe(201)
          done();
      })
      .catch(err =>{
        done(err)
      })
  });

  it('Empty Reuired Field, code:400', function(done) {
    request(app)
      .post('/customers')
      .set('access_token', adminToken)
      .expect('Content-Type', /json/)
      .send({
        name:'',
        address:"",
        email:"",
        phoneNumber:""
      })
      .then(response => {
        let{status,body} = response
          expect(status).toBe(400)
          expect(body).toHaveProperty("message",["Name Cannot Be Empty", "Address Cannot Be Empty", "Invalid E-Mail Format", "E-mail Cannot be Empty", "input Phone Number with Number"])
          done();
      })
      .catch(err =>{
        done(err)
      })
  });

  it('Empty Name Reuired Field, code:400', function(done) {
    request(app)
      .post('/customers')
      .set('access_token', adminToken)
      .expect('Content-Type', /json/)
      .send({
        name:'',
        address:"Jl.Patimura,No 3",
        email:"samuel@aol.com",
        phoneNumber:"081237261153"
      })
      .then(response => {
        let{status,body} = response
          expect(status).toBe(400)
            expect(body).toHaveProperty("message", ["Name Cannot Be Empty"])
          done();
      })
      .catch(err =>{
        done(err)
      })
  });

  it('Invalid Email Format, code:400', function(done) {
    request(app)
      .post('/customers')
      .set('access_token', adminToken)
      .expect('Content-Type', /json/)
      .send({
        name:'Samuel',
        address:"Jl.Patimura,No 3",
        email:"samuelAja",
        phoneNumber:"0812372611533"
      })
      .then(response => {
        let{status,body} = response
          expect(status).toBe(400)
            expect(body).toHaveProperty("message", ["Invalid E-Mail Format"])
          done();
      })
      .catch(err =>{
        done(err)
      })
  });
  it('Invalid Number Format, code:400', function(done) {
    request(app)
      .post('/customers')
      .set('access_token', adminToken)
      .expect('Content-Type', /json/)
      .send({
        name:'Samuel',
        address:"Jl.Patimura,No 3",
        email:"samuel@aol.com",
        phoneNumber:"09128tELP132"
      })
      .then(response => {
        let{status,body} = response
          expect(status).toBe(400)
            expect(body).toHaveProperty("message", ["input Phone Number with Number"])
          done();
      })
      .catch(err =>{
        done(err)
      })
  });
}); 

describe ('Delete /  Customer', function(){
  it('Success Delete Customer, Code:200', function(done){
      request(app)
      .delete(`/customers/${CustomerId}`)
      .set('access_token', adminToken)
      .then(response=>{
          let {status,body} = response
          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Customer Deleted")
          done()
      }).catch(err=>{
          done(err)
      })
  })

  it('Failed Delete Customer, Code:404', function(done){
    request(app)
    .delete(`/customers/99`)
    .set('access_token', adminToken)
    .then(response=>{
        let {status,body} = response
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "data not found")
        done()
    }).catch(err=>{
        done(err)
    })
})
});