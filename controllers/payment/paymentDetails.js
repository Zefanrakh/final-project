const { PaymentDetail } = require('../../models')

module.exports = class Controller {

  static async createPaymentDetail(req, res, next) {
    const { quantity, price, AppointmentId, PaymentMethodId } = req.body
    const input = { quantity, price, AppointmentId, PaymentMethodId }
    try {
      const paymentDetail = await PaymentDetail.create(input)
      !paymentDetail && next({ status: 400, message: 'Bad Request' })
      res.status(201).json(paymentDetail)
    } catch (error) {
      next(error)
    }
  }

  static async getPaymentDetails(req, res, next) {
    try {
      const paymentDetails = await PaymentDetail.findAll()
      !paymentDetails.length && next({ status: 404, message: 'Data Not Found' })
      res.status(200).json(paymentDetails)
    } catch (error) {
      next(error)
    }
  }

  static async getPaymentDetailsByAppointment(req, res, next) {
    const { id } = req.params
    try {
      const paymentDetail = await PaymentDetail.findOne({ where: { AppointmentId: id } })
      !paymentDetail && next({ status: 404, message: "Data Not Found" })
      res.status(200).json(paymentDetail)
    } catch (error) {
      next(error)
    }
  }
}