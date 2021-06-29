const router = require("express").Router();
const Controller = require("../controllers/appointmentController");
const {
  adminAuthorization,
  customerAuthorization,
  customerAppointmentAuthorization,
} = require("../middlewares/authorization");

router.get("/", Controller.getAppointment);
router.post("/", Controller.postAppointment);
router.get("/:id", Controller.getAppointmentById);
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
