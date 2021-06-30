const router = require("express").Router();
const Controller = require("../controllers/appointmentController");
const {
  adminAuthorization,
  customerAuthorization
} = require("../middlewares/authorization");

router.get("/", adminAuthorization, Controller.getAppointment);
router.post("/", Controller.postAppointment);

router.patch(
  "/:id",
  Controller.patchAppointment
);

router.get(
  "/customer/:CustomerId",
  customerAuthorization,
  Controller.getAppointmentByCustomerId
);

module.exports = router;
