const express = require('express')
const router = express.Router()
const CustomerController = require('../controllers/CustomerController');


router.get('/', CustomerController.getCustomer)
router.post('/', CustomerController.postCustomer)
router.get('/:id', CustomerController.getCustomerId)
router.delete(':id', CustomerController.deleteCustomer)






module.exports = router