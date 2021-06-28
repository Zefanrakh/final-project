const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");
const authentication = require("../middlewares/authentication");
const {
  adminAuthorization,
  customerAuthorization,
} = require("../middlewares/authorization");

router.get("/", adminAuthorization, CustomerController.getCustomer);
router.post("/", adminAuthorization, CustomerController.postCustomer);
router.get("/:id", customerAuthorization, CustomerController.getCustomerId);
router.delete("/:id", adminAuthorization, CustomerController.deleteCustomer);

module.exports = router;
