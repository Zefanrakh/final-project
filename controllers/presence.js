const { PresenceList, Appointment } = require('../models')

class Controller {
    static async postPresence(req, res, next) {
        try {
            const { dropperName, pickupperName, pickupTime, AppointmentId } = req.body
            const presenceDate = new Date()
            const insertedData = await PresenceList.create({dropperName, pickupperName, pickupTime, presenceDate, AppointmentId })
            res.status(201).json(insertedData)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getPresence() {
        try {
            const presenceList = await PresenceList.findAll({include: {model: Appointment}})
            res.status(200).json(presenceList)
        } catch (error) {
            next(error)
        }
    }

    static async getPresenceById() {
        try {
            const presenceList = await PresenceList.findOne({ where: {id: req.params.id}, include: {model: Appointment}})
            if(presenceList){
                res.status(200).json(presenceList)
            }else{
                next({status: 404, msg: 'data not found'})
            }
        } catch (error) {
            next(error)
        }
    }

    static async getPresenceByCustomerId() {
        try {
            const presenceList = await Appointment.findOne({ where: {CustomerId: req.params.CustomerId}, include: {model: Presence}})
            if(presenceList){
                res.status(200).json(presenceList)
            }else{
                next({status: 404, msg: 'data not found'})
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller