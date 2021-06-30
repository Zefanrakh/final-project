const { Appointment, Customer, Price } = require("../models");
const { Op } = require("sequelize");

class Controller {
    static async getAppointment(req, res, next){
        try {
            const appointments = await Appointment.findAll({ include: [{model: Customer}, {model: Price}] })
            res.status(200).json({message: 'read data success', data: appointments})
        } catch (error) {
            next(error);
        }
    }

    static async postAppointment(req, res, next){
        try {
            const {CustomerId, childName, childAge, startDate, endDate, status, childCategory, packageCategory, quantity, note} = req.body 
            const formatedStartDate = new Date(startDate)
            const formatedEndDate = new Date(endDate)
            const dateNow = new Date()
            if(formatedStartDate == "Invalid Date" || formatedEndDate == "Invalid Date"){
                throw({status: 400, message: 'End Date or start date format must be date'})
            }else{
                if( formatedStartDate < dateNow || formatedEndDate < dateNow){
                    throw({status: 400, message: 'start date or end date mus be equal or greater than today'})
                }
                if(formatedEndDate < formatedStartDate){
                    throw({status: 400, message: 'start date must be greater then end date'})
                }
            }
            const foundData = await Appointment.findOne({where: {CustomerId: CustomerId, [Op.or]: [{
                startDate: {
                    [Op.between]: [startDate, endDate]
                }
            }, {
                endDate: {
                    [Op.between]: [startDate, endDate]
                }
            }]} })
   
            if(foundData){
                throw({status: 400, message: 'Sudah ada appointment sebelumnya'})
            }else {
                const price = await Price.findOne({where: {category: childCategory, package: packageCategory}})
                const total = price.price * quantity
                const PriceId = price.id
                const insertedData = await Appointment.create({CustomerId, childName, childAge, startDate, endDate, status, PriceId, note})
                res.status(201).json(insertedData)
            }
        } catch (error) {
            console.log(error ,'==================>>>');
            next(error);
        }
    }

  static async getAppointmentByCustomerId(req, res, next) {
        try {
            const appointment = await Appointment.findAll({
                where: { CustomerId: req.params.CustomerId },
            });
            if (appointment.length > 0) {
                res.status(200).json(appointment);
            } else {
                next({ status: 404, message: "data not found" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async patchAppointment(req, res, next){
        const { status } = req.body
        try {
            const updatedData = await Appointment.update({ status }, {
                where: {
                  id: req.params.id
                },
                returning: true
            })
            if(updatedData[0] == 1){
                res.status(200).json(updatedData)
            }else{
                throw({status: 404, message: 'Data not found'})
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
