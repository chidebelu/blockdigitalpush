import Sharp from "../model/Sharp.js"
import asyncHandler from "express-async-handler"

export const saveInvestment = async (req, res) =>{
    const {plann, amount, date, user, method,email} = req.body
        console.log(req.body)
        try {
            const invested = await Sharp.create({
                plann,
                amount,
                date,
                user,
                method,
                email
            })

            return res.status(201).json({
                plann,
                amount,
                date,
                user,
                method,
                email
            })
        } catch (error) {
            console.log(error)
           return res.status(500).send("Network Error")
        }
}

export const getInvestment = async (req, res) =>{
        try {
            let user = await Sharp.findOne({user:req.params.id})
        if(!user) return res.status(404).send("User Not Found")
        
        res.status(200).json(user)
            
        
        } catch (error) {
            console.log(error)
            return res.status(500).send("Network Error")
        }
        
}

export const getAllDepositsList = asyncHandler( async (req, res)=>{
    const user = await Sharp.find({})
        res.status(200).json(user)
})

export const deleteInvestment = asyncHandler(async(req, res)=>{
    const user = await Sharp.findOne({user:req.params.id});
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})