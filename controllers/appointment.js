const { Appointment, Customer } = require('../models')

class Controller {
    static async getAppointment(req, res, next){
        try {
            let appointments
            if (req.query.status){
                appointments = await Appointment.findAll({
                    where: {status: eq.query.status},
                    include: {model: Customer}
                })
            } else {
                appointments = await Appointment.findAll({ include: {model: Customer} })
            }
            res.status(200).json(appointments)
        } catch (error) {
            next(error);
        }
    }

    static async postAppointment(req, res, next){
        try {
            req.currentUser = {CustomerId: 1}
            let {CustomerId, childName, childAge, startDate, endDate, status, PriceId, quantity, total, note} = req.body
            if(!CustomerId){
                CustomerId = req.currentUser.CustomerId
            }
            let insertedData = await Appointment.create({CustomerId, childName, childAge, startDate, endDate, status, PriceId, quantity, total, note})
            res.status(201).json(insertedData)
        } catch (error) {
            next(error);
        }
    }

    static async getAppointmentById(req, res, next){
        try {
            let appointment = await Appointment.findOne({where: {id: req.params.id}, include: {model: Customer}})
            if(appointment){
                res.status(200).json(appointment)
            }else{
                next({status:404, msg: 'data not found'})
            }
        } catch (error) {
            next(error);
        }
    }

    static async getAppointmentByCustomerId(req, res, next){
        try {
            let appointment = await Appointment.findAll({where: {Customerid: req.params.Customerid}})
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