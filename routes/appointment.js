const router = require('express').Router()
const Controller = require('../controllers/appointment')

router.get('/', Controller.getAppointment)
router.post('/', Controller.postAppointment)
router.get('/:id', Controller.getAppointmentById)
router.patch('/:id', Controller.patchAppointment)

module.exports = router