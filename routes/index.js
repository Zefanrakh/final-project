const router = require("express").Router();

const appointmentRouter = require("./appointment");
const presenceRouter = require("./presence");
const CustomerRouter = require("./customer");
const UserRouter = require("./user");
const checkoutRouter = require("./checkout");
const paymentRouter = require('./payment')
const priceRouter = require('./price')
const searchRouter = require("./search");

const { authentication, callbackTokenAuth } = require("../middlewares/authentication");
const { invoiceCallback } = require("../controllers/payment/xendit");

router.use("/user", UserRouter);
router.post('/callback', callbackTokenAuth, invoiceCallback)

router.use("/", authentication);

router.use("/search", searchRouter);
router.use("/appointment", appointmentRouter);
router.use("/presence", presenceRouter);
router.use("/customers", CustomerRouter);
router.use("/checkout", checkoutRouter);
router.use("/paymentDetails", paymentRouter)
router.use('/price', priceRouter)



module.exports = router;
