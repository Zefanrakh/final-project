const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(stripeSecretKey)

module.exports = stripe
