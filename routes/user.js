const express = require("express");
const Controller = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", Controller.register);
router.post("/checkexistemail", Controller.checkExistingEmail);
router.post("/checkexistusername", Controller.checkExistingUsername);
router.post("/login", Controller.login);
router.post("/getdata", authentication, Controller.getCurrentUser);

module.exports = router;
