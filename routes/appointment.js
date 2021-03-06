const router = require('express').Router()
const Controller = require('../controllers/appointmentController')

router.get('/', Controller.getAppointment)
router.post('/', Controller.postAppointment)
router.get('/:id', Controller.getAppointmentById)
router.patch('/:id', Controller.patchAppointment)
router.get('/customer/:customerId', Controller.getAppointmentByCustomerId)

module.exports = router