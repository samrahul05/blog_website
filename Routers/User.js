
                                // user file 
const express=require('express')
const router=express.Router()
const User=require('../Modules/User')
const bcrypt=require('bcrypt')
const verifyToken = require('../verifyToken')


// for update profile 

router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const data= new User({
        ...req.body
    })
    const { name } = req.body;

    try {
        const updatedMessage = await User.findOneAndUpdate(
            { _id: req.params.id, userId }, // Match both message ID and user ID
            { name }, // New data to update
            { new: true } // To return the updated record
            
        );
        console.log(updatedMessage)    
        

        if (updatedMessage) {
            return res.status(404).json({ message: 'Data not found or unauthorized' });
        }

        res.json({ message: 'Data updated successfully', data: updatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error updating data' });
    }
    // const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    // res.status(200).json(updatedUser)
});
// for delete profile 
// for get profile 



module.exports=router