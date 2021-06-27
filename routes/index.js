const router = require("express").Router();

const appointmentRouter = require("./appointment");
const presenceRouter = require("./presence");
const CustomerRouter = require("./customer");
const UserRouter = require("./userRoute");
const paymentRouter = require('./payment')

router.use("/appointment", appointmentRouter);
router.use("/presence", presenceRouter);
router.use("/customers", CustomerRouter);
router.use("/user", UserRouter);
router.use('/checkout', paymentRouter)

module.exports = router;
