const { PresenceList, Appointment } = require('../models')
const { sign, verify } = require("../helpers/jwt");
const sendEmail = require('../helpers/nodemailer')

class Controller {
    static async postPresence(req, res, next) {
        try {
            const { dropperName, pickupperName, pickupTime, AppointmentId, category, customerEmail, presenceDate } = req.body
            const formatedDate = new Date(presenceDate)
            if(formatedDate == "Invalid Date"){
                throw({status: 400, message: 'presenceDate format must be date'})
            }
            const foundPresence = await PresenceList.findOne({where: {AppointmentId, presenceDate}})
            if(foundPresence){
                throw({status: 400, message: 'Sudah absen untuk hari ini'})
            }else{
                const insertedData = await PresenceList.create({dropperName, pickupperName, pickupTime, presenceDate, AppointmentId })
                const token = sign({id: insertedData.id, presenceDate: insertedData.presenceDate, pickupperName: insertedData.pickupperName})
                const link = `http://localhost:3000/viewer/${category}?token=${token}`
                sendEmail(customerEmail, link)
                res.status(201).json({insertedData, token})
            }
        } catch (error) {
            console.log(error,"tess=====>");
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