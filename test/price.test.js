const request = require('supertest')
const app = require('../app')
const { sign } = require('../helpers/jwt')
const { User, Appointment, Customer } = require('../models')

let customerAccessToken, customerId, appointmentId, adminAccessToken
const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const userData = {
  username: 'second_admin',
  password: '123456',
  profilePicture:
    "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
  role: "admin",
}


beforeAll((done) => {
  User.create(userData)
    .then(newUser => {
      adminAccessToken = sign({
        username: newUser.username,
        role: newUser.role
      })
      done()
    })
    .catch(error => done(error))
})


describe('Fetch price list | Success', () => {
  it('Return Price List', done => {
    request(app)
      .get('/price')
      .set('access_token', adminAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Array))
        done()
      })
  })
})

describe('Fetch Price List | Failed', () => {
  it('Not Authorized | Invalid Access Token', done => {
    const expected = "Invalid signature. You don't have permission to access this page"
    request(app)
      .get('/price')
      .set('access_token', invalidAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Not Authorized | No Access Token', done => {
    const expected = "You must login first"
    request(app)
      .get('/price')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

describe('Fetch One Price by Id | Success', () => {
  it('Return One Product Price', done => {
    request(app)
      .get('/price/1')
      .set('access_token', adminAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.any(Object))
        done()
      })
  })
})

describe('Fetch One Price by Id | Failed', () => {
  it('Not Authorized | No Access Token', done => {
    const expected = "You must login first"
    request(app)
      .get('/price/1')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Not Authorized | Invalid Access Token', done => {
    const expected = "Invalid signature. You don't have permission to access this page"
    request(app)
      .get('/price/1')
      .set('access_token', invalidAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})
