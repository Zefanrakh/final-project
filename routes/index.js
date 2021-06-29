const router = require("express").Router();

const appointmentRouter = require("./appointment");
const presenceRouter = require("./presence");
const CustomerRouter = require("./customer");
const UserRouter = require("./user");
const paymentRouter = require("./payment");
const searchRouter = require("./search");
const authentication = require("../middlewares/authentication");

router.use("/user", UserRouter);

router.use("/", authentication);

router.use("/search", searchRouter);
router.use("/appointment", appointmentRouter);
router.use("/presence", presenceRouter);
router.use("/customers", CustomerRouter);
router.use("/checkout", paymentRouter);

module.exports = router;
