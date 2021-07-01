const { createPaymentDetail, getPaymentDetails, getPaymentDetailsByAppointment } = require('../controllers/payment/paymentDetails')
const router = require('express').Router()

router.post('/', createPaymentDetail)
router.get('/', getPaymentDetails)
router.get('/appointment/:id', getPaymentDetailsByAppointment)

module.exports = router
