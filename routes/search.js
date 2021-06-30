const express = require("express");
const Controller = require("../controllers/keywordController");
const router = express.Router();

router.get("/", Controller.searchByKeyword);

module.exports = router;
