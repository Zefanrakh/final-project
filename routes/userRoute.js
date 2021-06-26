const express = require("express");
const UserController = require("../controllers/UserController");
const authCheck = require("../middlewares/auth");
const router = express.Router();

router.post("/register", authCheck, UserController.register);
router.post("/login", authCheck, UserController.login);

module.exports = router;
