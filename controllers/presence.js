const { PresenceList, Appointment } = require('../models')
const { sign, verify } = require("../helpers/jwt");

class Controller {
    static async postPresence(req, res, next) {
        try {
            console.log(req.body);
            const { dropperName, pickupperName, pickupTime, AppointmentId } = req.body
            const presenceDate = new Date()
            const insertedData = await PresenceList.create({dropperName, pickupperName, pickupTime, presenceDate, AppointmentId })
            const token = sign({id: insertedData.id, presenceDate: insertedData.presenceDate, pickupperName: insertedData.pickupperName})
            console.log(verify(token),'decoded token');
            res.status(201).json({insertedData, token})
        } catch (error) {
            next(error)
        }
    }

    static async getPresence(req, res, next) {
        try {
            const presenceList = await PresenceList.findAll({include: {model: Appointment}})
            res.status(200).json(presenceList)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = Controller