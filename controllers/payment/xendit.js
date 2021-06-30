const xenditInstance = require("../../helpers/xendit")
const { Invoice: InvoiceModel, PaymentDetail } = require('../../models')
const callbackToken = process.env.CALLBACK_TOKEN
const xenditSecretKey = process.env.XENDIT_SECRET_KEY

const axios = require('axios')
const { VirtualAcc, Invoice, EWallet } = xenditInstance
const vaSpecificOptions = {}
const va = new VirtualAcc(vaSpecificOptions)

const ewalletSpecificOptions = {};
const ew = new EWallet(ewalletSpecificOptions);

const invoiceSpecificOptions = {};
const inv = new Invoice(invoiceSpecificOptions);
module.exports = class Controller {
  static async createVirtualAccount(req, res, next) {
    const uuid = await axios.get('https://www.uuidgenerator.net/api/version1')
    const { bankCode, expectedAmount: expectedAmt } = req.body
    const VAInput = { bankCode, name: 'SMART DAYCARE', externalID: uuid.data, isClosed: true, expectedAmt, isSingleUse: true }
    try {
      const virtualAccount = await va.createFixedVA(VAInput)
      res.status(200).json(virtualAccount)
    } catch (error) {
      next(error)
    }
  }

  static async payVirtualAccount(req, res, next) {
    const { externalID, amount } = req.body
    const apiKey = Buffer.from(`${xenditSecretKey}:`).toString('base64')
    const Authorization = 'Basic ' + apiKey
    try {
      const response = await axios({
        url: `https://api.xendit.co/callback_virtual_accounts/external_id=${externalID}/simulate_payment`,
        method: 'POST',
        data: { amount },
        headers: { Authorization }
      })
      res.status(200).json(response.data)
    } catch (error) {
      next(error)
    }
  }

  static async createInvoice(req, res, next) {
    const { role } = req.user
    const uuid = await axios.get('https://www.uuidgenerator.net/api/version1')
    const externalID = uuid.data
    const { amount, email: payerEmail, description } = req.body
    const input = { amount, payerEmail, externalID, description }
    try {
      const newInvoice = await inv.createInvoice(input)
      const {
        external_id: externalID,
        amount,
        status,
        payer_email: payerEmail,
        description,
        expiry_date: expiryDate,
        invoice_url: invoiceUrl
      } = newInvoice
      let invoiceInput = { externalID, status, amount, description, expiryDate, invoiceUrl, payerEmail }
      if (role === 'admin') {
        invoiceInput = (({ expiryDate, invoiceUrl, ...key }) => key)(invoiceInput)
        invoiceInput.status = 'Paid'
      }
      const dbInvoice = await InvoiceModel.create(invoiceInput)
      res.status(200).json(dbInvoice.dataValues)
    } catch (error) {
      next(error)
    }
  }

  static async invoiceCallback(req, res, next) {
    const { status, payment_channel: paymentMethod, external_id: externalID } = req.body
    const input = { status, paymentMethod }

    try {
      const selectedInvoice = await InvoiceModel.findOne({ where: { externalID } })
      const invoiceId = selectedInvoice.dataValues.id
      const updatePayment = await PaymentDetail.update({ status }, { where: { InvoiceId: invoiceId }, returning: true })
      const updatedInvoice = await InvoiceModel.update(input, { where: { externalID }, returning: true })
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.log(error);
      next(error)
    }

  }

}
