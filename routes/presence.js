const router = require('express').Router()
const Controller = require('../controllers/presence')

router.get('/', Controller.getPresence)
router.post('/', Controller.postPresence)

module.exports = router