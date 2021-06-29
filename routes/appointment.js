const router = require("express").Router();
const Controller = require("../controllers/appointmentController");
const {
  adminAuthorization,
  customerAuthorization,
  customerAppointmentAuthorization,
} = require("../middlewares/authorization");

router.get("/", adminAuthorization, Controller.getAppointment);
router.post("/", Controller.postAppointment);

router.patch(
  "/:id",
  customerAppointmentAuthorization,
  Controller.patchAppointment
);

router.get(
  "/customer/:customerId",
  customerAuthorization,
  Controller.getAppointmentByCustomerId
);

module.exports = router;
