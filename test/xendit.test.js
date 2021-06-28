const request = require('supertest')
const app = require('../app')



const VAccountInput = {
  bankCode: 'BCA',
  name: 'Karen',
  expectedAmount: 500000,
}

const invalidAmountInput = {
  bankCode: 'BCA',
  name: 'Karen',
  expectedAmount: ''
}

const VApayment = {
  amount: 500000,
  externalID: 'e6bba81a-d80c-11eb-b8bc-0242ac130003'
}


describe('Create Virtual Account | Success', () => {
  it('Create Virtual Account', done => {
    request(app)
      .post('/checkout/virtual-account')
      .send(VAccountInput)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id', expect.any(String))
        done()
      })
  })
})

describe('Create Virtual Account | Failed', () => {
  it('Invalid Request Error | Invalid Amount Field', done => {
    const expected = 'There was an error with the format submitted to the server.'
    request(app)
      .post('/checkout/virtual-account')
      .send(invalidAmountInput)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Missing Amount Field', done => {
    const missingAmountInput = {
      bankCode: 'BCA',
      name: 'Karen'
    }
    const expected = 'Expected amount is required for closed virtual accounts'
    request(app)
      .post('/checkout/virtual-account')
      .send(missingAmountInput)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Bank Code', done => {
    const invalidBankCode = { ...VAccountInput, bankCode: 'CIMB' }
    const expected = 'That bank code is not currently supported'
    request(app)
      .post('/checkout/virtual-account')
      .send(invalidBankCode)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Name', done => {
    const invalidName = { ...VAccountInput, name: 0 }
    const expected = 'There was an error with the format submitted to the server.'
    request(app)
      .post('/checkout/virtual-account')
      .send(invalidName)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Missing Name Field', done => {
    const missingName = (({ name, ...key }) => key)(VAccountInput)
    const expected = 'There was an error with the format submitted to the server.'
    request(app)
      .post('/checkout/virtual-account')
      .send(missingName)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

describe('Virtual Account Payment | Success', () => {
  it('Success Payment', done => {
    const expected = {
      "message": `Payment for the Fixed VA with external id e6bba81a-d80c-11eb-b8bc-0242ac130003 is currently being processed. Please ensure that you have set a callback URL for VA payments via Dashboard Settings and contact us if you do not receive a VA payment callback within the next 5 mins.`,
      "status": "COMPLETED"
    }
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(VApayment)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(expected))
        done()
      })
  })
})


describe('Virtual Account Payment | Failed', () => {
  it('Missing Amount', done => {
    const missingAmount = { externalID: 'demo-1234' }
    const expected = ['"amount" is required']
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(missingAmount)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Not Found | External ID', done => {
    const invalidExternalID = {
      amount: 500000,
      externalID: 'wrongID1234'
    }
    const expected = "Not Found"
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(invalidExternalID)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

describe('Create Invoice | Success', () => {
  it('Create Invoice', done => {

    const input = {
      externalID: '92e42760-d6b0-11eb-b8bc-0242ac130003',
      payerEmail: 'mcritaryo@gmail.com',
      amount: 500000,
      description: 'Jest Test'
    }
    request(app)
      .post('/checkout/invoice')
      .send(input)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        done()
      })
  })
})




