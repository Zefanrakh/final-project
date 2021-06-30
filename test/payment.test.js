const request = require('supertest')
const app = require('../app')
const { sign } = require('../helpers/jwt')
const { User, Appointment, Customer } = require('../models')
const axios = require('axios')

let customerAccessToken, customerId, appointmentId, invoiceId

const userData = {
  username: 'ekowidya25',
  password: 'ekowidya123',
  profilePicture:
    "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
  role: "customer",
  email: 'ekowidya25@gmail.com'
}

let appointmentData = {
  CustomerId: '',
  childName: 'Ben',
  childAge: '4',
  startDate: '2021-07-06',
  endDate: '2021-07-08',
  status: 'Active',
  quantity: 1,
  PriceId: 2,
  childCategory: 'Toddler',
  packageCategory: 'Monthly',
  note: 'Allergic to Nuts'
}

beforeAll((done) => {
  User.create(userData)
    .then((newUser) => {
      const customerData = {
        ...userData,
        phoneNumber: 12345678,
        name: userData.username,
        address: "1st street, 3rd block",
        UserId: newUser.id
      }
      customerAccessToken = sign({
        username: newUser.username,
        role: newUser.role
      })
      return Customer.create(customerData)
    })
    .then(newCustomer => {
      customerId = newCustomer.id
      appointmentData.CustomerId = customerId
      return Appointment.create(appointmentData)
    })
    .then(newAppointment => {
      appointmentId = newAppointment.id
      done()
    })
    .catch(error => done(error))
})

afterAll((done) => {
  User.destroy({ where: { username: userData.username } })
    .then(() => { return Customer.destroy({ where: { id: customerId } }) })
    .then(() => { return Appointment.destroy({ where: { id: appointmentId } }) })
    .then(() => done())
    .catch(err => done(err))
})

const stripePaymentData = {
  package: 'Daily',
  quantity: 2,
  category: 'Infant',
  paymentType: 'card'
}
const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const VAccountInput = {
  bankCode: 'BCA',
  expectedAmount: 500000,
}
const invoiceInput = {
  amount: 500000,
  email: 'karina@gmail.com',
  description: 'Monthly - Toddler'
}

const VApayment = {
  amount: 500000,
  externalID: Math.random().toString(36).substring(2, 12)
}

const xenditExpectedVA = {
  is_closed: true,
  status: 'PENDING',
  currency: 'IDR',
  owner_id: '60d69701f91bf66b7f41c770',
  external_id: expect.any(String),
  bank_code: 'BCA',
  merchant_code: '10766',
  name: 'SMART DAYCARE',
  account_number: expect.any(Number),
  expected_amount: 500000,
  is_single_use: true,
  expiration_date: expect.any(String),
  id: expect.any(String)
}

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

const stripeLineItems = {
  id: 'li_1J7HsxFGoyuOvgcvJHLHbT7n',
  object: 'item',
  amount_subtotal: 1578000000,
  amount_total: 1578000000,
  currency: 'idr',
  description: 'Monthly - Toddler',
  price: {
    id: 'price_1J6ADTFGoyuOvgcvjN68D20A',
    object: 'price',
    active: true,
    billing_scheme: 'per_unit',
    created: 1624609007,
    currency: 'idr',
    livemode: false,
    lookup_key: null,
    metadata: {},
    nickname: null,
    product: 'prod_JjdUEz4q79CPM2',
    recurring: null,
    tiers_mode: null,
    transform_quantity: null,
    type: 'one_time',
    unit_amount: 526000000,
    unit_amount_decimal: '526000000'
  },
  quantity: 3
}

const callbackPayload = {
  "id": "579c8d61f23fa4ca35e52da4",
  "external_id": "invoice_123124123",
  "user_id": "5781d19b2e2385880609791c",
  "is_high": true,
  "payment_method": "BANK_TRANSFER",
  "status": "PAID",
  "merchant_name": "Xendit",
  "amount": 50000,
  "paid_amount": 50000,
  "bank_code": "PERMATA",
  "paid_at": "2016-10-12T08:15:03.404Z",
  "payer_email": "wildan@xendit.co",
  "description": "This is a description",
  "adjusted_received_amount": 47500,
  "fees_paid_amount": 0,
  "updated": "2016-10-10T08:15:03.404Z",
  "created": "2016-10-10T08:15:03.404Z",
  "currency": "IDR",
  "payment_channel": "PERMATA",
  "payment_destination": "888888888888"
}

describe('Stripe Checkout | Success', () => {
  it('Success Case', done => {
    request(app)
      .post('/checkout/stripe')
      .send(stripePaymentData)
      .set('access_token', customerAccessToken)
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

  it('Not Authorized | No Access Token', done => {
    const expected = "You must login first"
    request(app)
      .post('/checkout/stripe')
      .send(stripePaymentData)
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
      .post('/checkout/stripe')
      .send(stripePaymentData)
      .set('access_token', invalidAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Invalid Request Error | Invalid Quantity', done => {
    const failedInvalidQuantity = { ...stripePaymentData, quantity: 0 }
    const expected = "line_items[0][quantity]\nThis value must be greater than or equal to 1."
    request(app)
      .post('/checkout/stripe')
      .send(failedInvalidQuantity)
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

describe('Fetch Line Items | Success', () => {
  it('Fetch Line Items', done => {
    const id = 'cs_test_a1Ttx4AdKKEG2AGpj0JZRXOdxYns8i6Imh5lsROzYe898Gp5p15YQ7szD0#fidkdWxOYHwnPyd1blpxYHZxWjA0TzB8PDFDQmp8cEpzYmZzYTF2aVRUNW00MlY0Rj1SU002RF1tZEk8MGM9TH1Hc1dTf3B1bjwwT0I0RzVSUmJpX2dCdjRRckFzQTMyMDxgTG9kUmN2MU5iNTVGMn9cQzdibScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
    request(app)
      .get(`/checkout/success/${id}`)
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(stripeLineItems))
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
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
  it('Not Authorized | No Access Token', done => {
    const id = 'cs_test_a1Ttx4AdKKEG2AGpj0JZRXOdxYns8i6Imh5lsROzYe898Gp5p15YQ7szD0#fidkdWxOYHwnPyd1blpxYHZxWjA0TzB8PDFDQmp8cEpzYmZzYTF2aVRUNW00MlY0Rj1SU002RF1tZEk8MGM9TH1Hc1dTf3B1bjwwT0I0RzVSUmJpX2dCdjRRckFzQTMyMDxgTG9kUmN2MU5iNTVGMn9cQzdibScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
    const expected = "You must login first"
    request(app)
      .get(`/checkout/success/${id}`)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Not Authorized | Invalid Access Token', done => {
    const id = 'cs_test_a1Ttx4AdKKEG2AGpj0JZRXOdxYns8i6Imh5lsROzYe898Gp5p15YQ7szD0#fidkdWxOYHwnPyd1blpxYHZxWjA0TzB8PDFDQmp8cEpzYmZzYTF2aVRUNW00MlY0Rj1SU002RF1tZEk8MGM9TH1Hc1dTf3B1bjwwT0I0RzVSUmJpX2dCdjRRckFzQTMyMDxgTG9kUmN2MU5iNTVGMn9cQzdibScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
    const expected = "Invalid signature. You don't have permission to access this page"
    request(app)
      .get(`/checkout/success/${id}`)
      .set('access_token', invalidAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

describe('Create Virtual Account | Success', () => {
  it('Create Virtual Account', done => {
    request(app)
      .post('/checkout/virtual-account')
      .send(VAccountInput)
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(xenditExpectedVA))
        done()
      })
  })
})

describe('Create Virtual Account | Failed', () => {
  it('Not Authorized | No Access Token', done => {
    const expected = "You must login first"
    request(app)
      .post('/checkout/virtual-account')
      .send(VAccountInput)
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
      .post('/checkout/virtual-account')
      .send(VAccountInput)
      .set('access_token', invalidAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })


  it('Invalid Request Error | Invalid Amount Field', done => {
    const invalidAmountInput = { ...VAccountInput, expectedAmount: "" }
    const expected = 'There was an error with the format submitted to the server.'
    request(app)
      .post('/checkout/virtual-account')
      .send(invalidAmountInput)
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
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
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  // it.only('Invalid Request Error | Missing Name Field', done => {
  //   const missingName = (({ name, ...key }) => key)(VAccountInput)
  //   const expected = 'There was an error with the format submitted to the server.'
  //   request(app)
  //     .post('/checkout/virtual-account')
  //     .send(missingName)
  //     .set('access_token', customerAccessToken)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       console.log(res.body,"<<<< ini missing name field");
  //       expect(res.status).toBe(400)
  //       expect(res.body).toHaveProperty('message', expected)
  //       done()
  //     })
  // })
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
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(expected))
        done()
      })
  })
})


describe('Virtual Account Payment | Failed', () => {

  it('Not Authorized | No Access Token', done => {
    const expected = "You must login first"
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(VApayment)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })

  it('Missing Amount', done => {
    const missingAmount = { externalID: Math.random().toString(36).substring(2, 12) }
    const expected = ['"amount" is required']
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(missingAmount)
      .set('access_token', customerAccessToken)
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
      externalID: Math.random().toString(36).substring(2, 12)
    }
    const expected = "Not Found"
    request(app)
      .post('/checkout/virtual-account/pay')
      .send(invalidExternalID)
      .set('access_token', customerAccessToken)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', expected)
        done()
      })
  })
})

// describe.only('Invoice Callback | Success', () => {
//   it('Callback Token Verified', done => {
//     const headers = {
//       host: 'ce3e094d0cec.ngrok.io',
//       'content-length': '555',
//       'content-type': 'application/json',
//       'x-callback-token': 'w4w9e8lTj493oGXjngWILFJWPyPzdUEHDAmrkV7tHvtrLojP',
//     }
//     const expected = 'Success'
//     request(app)
//       .post('/callback')
//       .send(callbackPayload)
//       .set(headers)
//       .end((err, res) => {
//         console.log(err,"rttt");
//         console.log(res.body,"<,<<<");
//         if (err) return done(err)
//         expect(res.status).toBe(200)
//         expect(res.body).toHaveProperty('message', expected)
//         done()
//       })
//   })
// })


describe('Create Invoice | Success', () => {
  it('Generate an invoice', done => {
    request(app)
      .post('/checkout/invoice')
      .set('access_token', customerAccessToken)
      .send(invoiceInput)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id', expect.any(Number))
        expect(res.body).toHaveProperty('externalID', expect.any(String))
        expect(res.body).toHaveProperty('amount', invoiceInput.amount)
        expect(res.body).toHaveProperty('description', invoiceInput.description)
        expect(res.body).toHaveProperty('invoiceUrl', expect.any(String))
        done()
      })
  })
})

describe('Create Invoice | Failed', () => {

  it('| Invalid Amount', done => {
    const invalidAmount = {
      amount: '',
      email: 'karina@gmail.com'
    }
    request(app)
      .post('/checkout/invoice')
      .set('access_token', customerAccessToken)
      .send(invalidAmount)
      .end((err, res) => {
        if (err) return done(err)
        console.log(res.body);
        expect(res.status).toBe(200)
        done()
      })
  })
})


