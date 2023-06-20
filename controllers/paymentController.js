import Payment from "../model/Payment.js"
import asyncHandler from "express-async-handler"

export const getAllWithdrawalRequests = asyncHandler(async (req, res)=>{
    const user = await Payment.find({})
     res.json(user)
    
})

export const saveWithdrawalRequest = asyncHandler( async (req, res)=>{
    const {firstname, email, plan, method, amount, user, date } = req.body
    try {
         await Payment.create({
            firstname,
            email,
            plan,
            method,
            amount,
            user,
            date
        })

        return res.status(201).json({
            firstname,
            email,
            plan,
            method,
            amount,
            user,
            date
        })
    } catch (error) {
        console.log(error)
    }
}) 

export const getUserWithdrawalList = asyncHandler( async (req, res)=>{
    console.log(req.params.id)
    try {
        const user = await Payment.findOne({user: req.params.id})
    if(!user)res.status(404).json("User Not Found")
        res.status(200).json(user)
    
    } catch (error) {
        console.log(error)    
        return res.status(500).send("Network Error")
    }
})

export const deleteWithdrawalRequests = asyncHandler( async(req, res)=>{
    try {
        let user = await Payment.findById(req.params.id)
        if(user){
         await user.remove()
        }
    } catch (error) {
        res.status(404);
        throw new Error('User not found');
    }
})
export const adminUpdateSingleUserWithdrawalRequest = asyncHandler( async (req, res)=>{
    const user = await Payment.findById(req.body._id)
    if(user){
        user.firstname = req.body.firstname || user.firstname 
        user.email = req.body.email || user.email 
        user.plan = req.body.plan || user.plan 
        user.method = req.body.method || user.method 
        user.amount = req.body.amount || user.amount 
        user.status = req.body.status || user.status 

        const updatedUser = await user.save()

        res.status(201).json({
          firstname:  updatedUser.firstname,
         email:   updatedUser.email,
         plan:   updatedUser.plan,
         method:   updatedUser.method,
          amount:  updatedUser.amount,
           status: updatedUser.status
        })
    }
        
        else{
            res.status(404)
            throw new Error('User Not Found');
        }
    
})

 