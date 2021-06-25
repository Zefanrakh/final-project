const {Customer} = require('../models/index')

class CustomerController{
    static getCustomer(req,res,next){// next digunakan menyesuaikan error handler
        Customer.findAll()
        .then(customers=>{
            res.status(200).json({customers})
        })
        .catch(err=>{
            res.status(500).json({message:"Internal Server Error"})
        })
    }

    static postCustomer(req,res,next){
        let createCustomer={
            name:req.body.name,
            address:req.body.address,
            email:req.body.email,
            profilePicture:req.body.profilePicture,
            phoneNumber:req.body.phoneNumber
        }
        Customer.create(createCustomer)
        .then(customer=>{
            res.status(201).json({customer})
        }).catch(err=>{
            next(err)
        })
    }

    static getCustomerId(req, res, next){
        let id = req.params.id
        Customer.findByPk(id)
        .then(customer=>{
            if(!customer){
                res.status(404).json({message:err.message})
            }else{
                res.status(200).json({customer})
            }
        })
        .catch(err=>{
            next(err)
        })
    }

    static deleteCustomer(req,res,next){
        let id = req.params.id
        Customer.destroy({where:{id}})
        .then(customer=>{
            if(!customer){
                res.status(404).json({message:err.message})
            }else{
                res.status(200).json({message:"Customer Deleted"})
            }
        })
        .catch(err=>{
            next(err)
        })
    }
}



module.exports = CustomerController