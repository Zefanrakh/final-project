const { getPriceList, getPriceById } = require('../controllers/priceController')

const router = require('express').Router()


router.get('/price', getPriceList)
router.get('/price/:id', getPriceById)

module.exports = router