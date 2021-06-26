const router = require('express').Router()

const appointmentRouter = require('./appointment')
const presenceRouter = require('./presence')

router.use('/appointment',appointmentRouter)
router.use('/presence',presenceRouter)

module.exports = router