const stripe = require("../../helpers/stripe");

module.exports = class Controller {
  static async stripeCheckout(req, res, next) {
    const { package: selectedPackage, quantity, category } = req.body
    
    try {
      const products = await stripe.products.list()
      const prices = await stripe.prices.list()
      const selectedProduct = products.data.find(product => product.name.includes(`${selectedPackage} - ${category}`))
      const selectedPrice = prices.data.find(price => price.product === selectedProduct.id)

      const checkoutInput = {
        success_url: 'http://localhost:3000/checkout/success/{CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/checkout/',
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price: selectedPrice.id,
          quantity
        }]
      }
      const session = await stripe.checkout.session.create(checkoutInput)
      res.status(200).json(session)
    } catch (error) {
      next(error)
    }
  }

  static async successCheckout(req, res, next) {
    const sessionId = req.params.id
    try {
      const LineItemList = await stripe.checkout.sessions.listLineItems(sessionId)
      res.status(200).json(LineItemList.data[0])
    } catch (error) {
      next(error)
    }
  }
}
