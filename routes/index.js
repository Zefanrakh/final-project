const router = require('express').Router()

const appointmentRouter = require('./appointment')
const presenceRouter = require('./presence')
const CustomerRouter = require('./customer')

router.use('/appointment',appointmentRouter)
router.use('/presence',presenceRouter)
router.use('/customers', CustomerRouter)

module.exports = router