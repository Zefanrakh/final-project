const request = require('supertest')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const app = require('../app')
const {Customer} = require('../models/index')
let id=0;

beforeAll((done)=>{
  // createAdmin()
  request(app)
  .post('/customers')
  .send({
      name:'Rizky',
      address:"Jl.Patimura,No 4",
      email:"Rizky@aol.com",
      phoneNumber:"081269327604"
      })
  .then(customer=>{
    id = customer.body.customer.id
      done()
  }).catch(err=>{
      done(err)
  })
})

afterAll((done)=>{
  if(process.env.NODE_ENV === "test"){
    // Customer.destroy({ truncate: {cascade:true, restartIdentity:true}})
    //   .then(()=>{
    //       done()
    //   })
    //   .catch(err=>{
    //       done(err)
    //   })
    queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity:true, cascade:true }) 
      .then(()=>{
        done()
    })
    .catch(err=>{
        done(err)
    })
  }
})

describe ('Read / Customer', function(){
  it('Success Get All Customer, code:200', function(done){
      request (app)
      .get(`/customers`)
      // .set('access_token',adminToken)
      .then(response=>{
          let {status, body} = response
          expect(status).toBe(200)
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
      .set('Accept', 'application/json')
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
  console.log(id, "<<<<<<<<<<<<<<<<<")
  it('Success Delete Customer, Code:200', function(done){
      request(app)
      .delete(`/customers/${id}`)
      .then(response=>{
          let {status,body} = response
          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Customer Deleted")
          done()
      }).catch(err=>{
          done(err)
      })
  })
});