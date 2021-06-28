const request = require('supertest')
const app = require('../app')

const stripePaymentData = {
  package: 'Daily',
  quantity: 2,
  category: 'Infant',
  paymentType: 'card'
}

const failedInvalidQuantity = { ...stripePaymentData, quantity: 0 }
const failedNoCurrency = {
  success_url: 'http://localhost:3000/checkout/success/{CHECKOUT_SESSION_ID}',
  cancel_url: 'http://localhost:3000/checkout/',
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: [{
    price: "",
    quantity: 2
  }]
}

const failedPaymentMethodArray = { ...failedNoCurrency, payment_method_types: 'card' }
// beforeAll((done) => {
//   request(app) 
//   //loginCustomer
//   done()
// })

const failedPaymentMethodType = { ...failedNoCurrency, payment_method_types: ['creditcard'] }

const stripeExpectedSuccess = {
  id: expect.any(String),
  object: 'checkout.session',
  allow_promotion_codes: null,
  amount_subtotal: expect.any(Number),
  amount_total: expect.any(Number),
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://localhost:3000/checkout/',
  client_reference_id: null,
  currency: 'idr',
  customer: null,
  customer_details: null,
  customer_email: null,
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: expect.any(String),
  payment_method_options: {},
  payment_method_types: ['card'],
  payment_status: 'unpaid',
  setup_intent: null,
  shipping: null,
  shipping_address_collection: null,
  submit_type: null,
  subscription: null,
  success_url: 'http://localhost:3000/checkout/success/{CHECKOUT_SESSION_ID}',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: expect.any(String)
}

describe('Stripe Checkout | Success', () => {
  it('Success Case', done => {
    request(app)
      .post('/checkout/stripe')
      .send(stripePaymentData)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id', expect.any(String))
        expect(res.body).toHaveProperty('object', "checkout.session")
        expect(res.body).toEqual(expect.objectContaining(stripeExpectedSuccess))
        done()
      })
  })
})

describe('Stripe Checkout | Failed', () => {
  it('Invalid Request Error | Invalid Quantity', done => {
    const expected = "line_items[0][quantity]\nThis value must be greater than or equal to 1."
    request(app)
      .post('/checkout/stripe')
      .send(failedInvalidQuantity)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Package', done => {
    const expected = "Product Not Found"
    const invalidPackage = {
      package: 'Hourly',
      quantity: 2,
      category: 'Toddler',
      paymentType: 'card'
    }
    request(app)
      .post('/checkout/stripe')
      .send(invalidPackage)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Category', done => {
    const expected = "Product Not Found"
    const invalidCategory = {
      package: 'Daily',
      quantity: 2,
      category: 'Baby',
      paymentType: 'card'
    }
    request(app)
      .post('/checkout/stripe')
      .send(invalidCategory)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Payment Type', done => {
    const expected = "payment_method_types[0]\nInvalid payment_method_types[0]: must be one of alipay, card, ideal, fpx, bacs_debit, bancontact, giropay, p24, eps, sofort, sepa_debit, grabpay, afterpay_clearpay, or acss_debit"
    const invalidPaymentType = { ...stripePaymentData, paymentType: 'cardi' }
    request(app)
      .post('/checkout/stripe')
      .send(invalidPaymentType)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Missing Payment Type', done => {
    const expected = 'Missing required param: payment_method_types.'
    const missingPaymentType = (({ paymentType, ...key }) => key)(stripePaymentData)
    request(app)
      .post('/checkout/stripe')
      .send(missingPaymentType)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  describe('Fetch Line Items | Success', () => {
    it('Fetch Line Items', done => {
      const id = 'cs_test_a1Ttx4AdKKEG2AGpj0JZRXOdxYns8i6Imh5lsROzYe898Gp5p15YQ7szD0#fidkdWxOYHwnPyd1blpxYHZxWjA0TzB8PDFDQmp8cEpzYmZzYTF2aVRUNW00MlY0Rj1SU002RF1tZEk8MGM9TH1Hc1dTf3B1bjwwT0I0RzVSUmJpX2dCdjRRckFzQTMyMDxgTG9kUmN2MU5iNTVGMn9cQzdibScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
      request(app)
        .get(`/checkout/success/${id}`)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('id', expect.any(String))
          done()
        })
    })
  })

  describe('Fetch Line Items | Failed', () => {
    it('Not Found | Invalid Session Id', done => {
      const id = 'DEMO_cs_test_a1Ttx4AdKKEG2AGpj0JZRXOdxYns8i6Imh5lsROzYe898Gp5p15YQ7szD0#fidkdWxOYHwnPyd1blpxYHZxWjA0TzB8PDFDQmp8cEpzYmZzYTF2aVRUNW00MlY0Rj1SU002RF1tZEk8MGM9TH1Hc1dTf3B1bjwwT0I0RzVSUmJpX2dCdjRRckFzQTMyMDxgTG9kUmN2MU5iNTVGMn9cQzdibScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
      const expected = 'No such checkout session'
      request(app)
        .get(`/checkout/success/${id}`)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.status).toBe(404)
          expect(res.body).toHaveProperty('message', expected)
          done()
        })
    })

  })

  


  // it('Invalid Request Error | Missing Currency', done => {
  //   const expected = "Missing required param: line_items[0][currency]."
  //   request(app)
  //     .post('/checkout/stripe')
  //     .send(failedNoCurrency)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       expect(res.status).toBe(400)
  //       expect(res.body).toHaveProperty('message', expected)
  //       done()
  //     })
  // })

  // it('Invalid Request Error | Invalid Array', done => {
  //   const expected = "payment_method_types\nInvalid array"
  //   request(app)
  //     .post('/checkout/stripe')
  //     .send(failedPaymentMethodArray)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       expect(res.status).toBe(400)
  //       expect(res.body).toHaveProperty('message', expected)
  //       done()
  //     })
  // })

  //   it('Invalid Request Error | Invalid Payment Method Type', done => {
  //     const expected = "payment_method_types[0]\nInvalid payment_method_types[0]: must be one of alipay, card, ideal, fpx, bacs_debit, bancontact, giropay, p24, eps, sofort, sepa_debit, grabpay, afterpay_clearpay, or acss_debit"
  //     request(app)
  //       .post('/checkout/stripe')
  //       .send(failedPaymentMethodType)
  //       .end((err, res) => {
  //         if (err) return done(err)
  //         expect(res.status).toBe(400)
  //         expect(res.body).toHaveProperty('message', expected)
  //         done()
  //       })
  //   })
})
