const router = require('express').Router()
const Controller = require('../controllers/appointmentController')

router.get('/', Controller.getAppointment)
router.post('/', Controller.postAppointment)
router.patch('/:id', Controller.patchAppointment)
router.get('/customer/:CustomerId', Controller.getAppointmentByCustomerId)

module.exports = router