const router = require('express').Router()
const CustomerRoute = require('../routes/CustomerRouter')




router.use('/customers', CustomerRoute)


module.exports = router