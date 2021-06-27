const express = require("express");
const Controller = require("../controllers/userController");
const fbAuthCheck = require("../middlewares/fbauth");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", fbAuthCheck, Controller.register);
router.post("/login", Controller.login);
router.post("/getdata", authentication, Controller.getCurrentUser);

module.exports = router;
