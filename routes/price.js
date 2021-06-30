const { getPriceList, getPriceById } = require('../controllers/priceController')

const router = require('express').Router()


router.get('/', getPriceList)
router.get('/:id', getPriceById)

module.exports = router