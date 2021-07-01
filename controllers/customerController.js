const {Customer} = require('../models/index')

class CustomerController{
    static async getCustomer(req,res,next){// next digunakan menyesuaikan error handler
        try {
            let customers = await Customer.findAll()
            res.status(200).json({customers})
        } catch (error) {
            next(error)
        }   
    }

    static postCustomer(req,res,next){
        let createCustomer={
            name:req.body.name,
            address:req.body.address,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber
        }
        Customer.create(createCustomer)
        .then(customer=>{
            res.status(201).json({customer})
        }).catch(err=>{
            next(err)
        })
    }

    static async deleteCustomer(req,res,next){
        
        try {
            let id = req.params.id
            let deletedData = await Customer.destroy({where:{id}})
            if(deletedData === 0){
                throw({status: 404, message: 'data not found'})
            }else{
                res.status(200).json({message:"Customer Deleted"})
            }
        } catch (error) {
            next(error)
        }
    }
}



module.exports = CustomerController