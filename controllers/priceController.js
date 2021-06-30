const { Price } = require('../models')

module.exports = class Controller {
  static async getPriceList(req, res, next) {
    try {
      const priceList = await Price.findAll()
      !priceList && next({ status: 400, message: 'Bad Request' })
      res.status(200).json(priceList)
    } catch (error) {
      next(error)
    }
  }

  static async getPriceById(req, res, next) {
    const { id } = req.params
    try {
      const price = await Price.findByPk(id)
      !price && next({ status: 404, message: 'Data Not Found' })
      res.status(200).json(price)
    } catch (error) {
      next(error)
    }
  }
}
