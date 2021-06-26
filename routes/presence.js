const router = require('express').Router()
const Controller = require('../controllers/presence')

router.get('/', Controller.getPresence)
router.post('/', Controller.postPresence)
router.get('/:id', Controller.getPresenceById)
router.get('/customer/:customerId', Controller.getPresenceByCustomerId)

module.exports = router