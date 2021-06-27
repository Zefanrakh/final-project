const router = require("express").Router();

const appointmentRouter = require("./appointment");
const presenceRouter = require("./presence");
const CustomerRouter = require("./customer");
const UserRouter = require("./userRoute");

router.use("/appointment", appointmentRouter);
router.use("/presence", presenceRouter);
router.use("/customers", CustomerRouter);
router.use("/user", UserRouter);

module.exports = router;
