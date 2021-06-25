const router = require('express').Router()

const appointmentRouter = require('./appointment')

router.use('/appointment',appointmentRouter)

module.exports = router