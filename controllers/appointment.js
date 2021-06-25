const { Appointment } = require('../models')

class Controller {
    static async getAppointment(req, res, next){
        try {
            let appointments
            if (req.query.status){
                appointments = await Appointment.findAll({
                    where: {status: eq.query.status}
                })
            } else {
                appointments = await Appointment.findAll()
            }
            res.status(200).json(appointments)
        } catch (error) {
            next(error);
        }
    }

    static async postAppointment(req, res, next){
        const {CustomerId, dropperName, pickuperName, childName, childAge, appointmentDate, pickupTime, status} = req.body
        try {
            let insertedData = await Appointment.create({CustomerId, dropperName, pickuperName, childName, childAge, appointmentDate, pickupTime, status})
            res.status(201).json(insertedData)
        } catch (error) {
            next(error);
        }
    }

    static async getAppointmentById(req, res, next){
        try {
            let appointment = await Appointment.findOne({where: {id: req.params.id}})
            if(appointment){
                res.status(200).json(appointment)
            }else{
                res.status(404).json({message: 'data not found'})
            }
        } catch (error) {
            next(error);
        }
    }

    static async patchAppointment(req, res, next){
        const { status } = req.body
        try {
            let updatedData = await Appointment.update({ status: status }, {
                where: {
                  id: req.params.id
                },
                returning: true
              })
              if(updatedData){
                res.status(200).json(updatedData)
              }else{
                res.status(400).json({message: 'Data not found'})
              }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller