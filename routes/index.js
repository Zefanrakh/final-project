const express = require("express");
const errorHandler = require("../middlewares/errorHandler");
const router = express.Router();
const userRoute = require("./userRoute");

router.use("/user", userRoute);

router.use(errorHandler);
module.exports = router;
