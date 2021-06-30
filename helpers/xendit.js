const xenditSecretKey = process.env.XENDIT_SECRET_KEY

const Xendit = require('xendit-node')
const xenditInstance = new Xendit({
  secretKey: xenditSecretKey
})

module.exports = xenditInstance
