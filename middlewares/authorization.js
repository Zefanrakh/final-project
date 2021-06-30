const { Customer, User, Appointment } = require("../models");

const adminAuthorization = async (req, res, next) => {
  try {
    if (req.user.role === "admin") next();
    else throw { status: 401, message: "You're not authorized" };
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
    let idParam = req.params.id || req.params.CustomerId;
    if (customer.id === Number(idParam)) next();
    else throw { status: 401, message: "You're not authorized" };
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
    console.log(customer,'masuk sisni');
    const targetAppointment = customer.Appointments.find((appointment) => {
      appointment.id === Number(req.params.id);
    });
    if (targetAppointment) next();
<<<<<<< HEAD
    else next({ status: 401, message: "You are not authorized" });
=======
    else throw { status: 401, message: "You are not authorized" };
>>>>>>> fb9254d7f5c9e7be3b9392f121131bb651b4470e
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminAuthorization,
  customerAuthorization,
  customerAppointmentAuthorization,
};
