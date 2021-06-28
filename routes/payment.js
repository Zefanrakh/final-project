const { stripeCheckout, successCheckout } = require('../controllers/payment/stripe')
const { createVirtualAccount, payVirtualAccount, createInvoice } = require('../controllers/payment/xendit')

const router = require('express').Router()

router.post('/stripe', stripeCheckout)
router.get('/success/:id', successCheckout)
router.post('/virtual-account', createVirtualAccount)
router.post('/virtual-account/pay', payVirtualAccount)
router.post('/invoice', createInvoice)

module.exports = router
