const xenditInstance = require("../../helpers/xendit")
const axios = require('axios')
const { VirtualAcc } = xenditInstance
const vaSpecificOptions = {}
const va = new VirtualAcc(vaSpecificOptions)

module.exports = class Controller {

  static async createVirtualAccount(req, res, next) {
    const uuid = await axios.get('https://www.uuidgenerator.net/api/version1')
    const { bankCode, expectedAmount: expectedAmt, name } = req.body
    const input = { bankCode, name, externalID: uuid.data, isClosed: true, expectedAmt, isSingleUse: true }
    try {
      const virtualAccount = await va.createFixedVA(input)
      res.status(200).json(virtualAccount)
    } catch (error) {
      next(error)
    }
  }

  static async payVirtualAccount(req, res, next) {
    const { externalID, amount } = req.body
    const apiKey = Buffer.from('xnd_development_8dXbmGB2nVRvfG5KNoAH79ns9VhT7DkVotShlIoFsegpW4gM3KL01BH52xBHDJ:').toString('base64')
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
}
