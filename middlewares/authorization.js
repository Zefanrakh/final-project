const { Customer, User, Appointment } = require("../models");

const adminAuthorization = async (req, res, next) => {
  try {
    if (req.user.role === "admin") next();
    else next ({ status: 401, message: "You're not authorized" })
  } catch (err) {
    next(err);
  }
};

const customerAuthorization = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: {
        UserId: req.user.id,
      },
    });
    let idParam = req.params.id || req.params.customerId;
    if (customer.id === Number(idParam)) next();
    else next ({ status: 401, message: "You're not authorized" })
  } catch (err) {
    next(err);
  }
};

const customerAppointmentAuthorization = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: {
        UserId: req.user.id,
      },
      include: {
        model: Appointment,
      },
    });
    const targetAppointment = customer.Appointments.find((appointment) => {
      appointment.id === Number(req.params.id);
    });
    if (targetAppointment) next();
    else next ({ status: 401, message: "You are not authorized" })
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminAuthorization,
  customerAuthorization,
  customerAppointmentAuthorization,
};
