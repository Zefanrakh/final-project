const { createPaymentDetail, getPaymentDetails, getPaymentDetailsByAppointment } = require('../controllers/payment/paymentDetails')
const router = require('express').Router()

router.post('/', createPaymentDetail)
router.get('/', getPaymentDetails)
router.get('/:id', getPaymentDetailsByAppointment)

module.exports = router
