const router = require('express').Router()
const CustomerController = require('../controllers/CustomerController');


router.get('/customers', CustomerController.getCustomer)
router.get('/customers/:id', CustomerController.getCustomerId)
router.post('/customers', CustomerController.postCustomer)
router.delete('/customers/:id', CustomerController.deleteCustomer)



module.exports = router