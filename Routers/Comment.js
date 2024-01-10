

const express=require('express')
const router=express.Router()
const User=require('../Modules/User')
const bcrypt=require('bcrypt')
const Post=require('../Modules/Post')
const Comment=require('../Modules/comment')
const verifyToken = require('../verifyToken')


//CREATE
// router.post("/create",verifyToken,async (req,res)=>{
//     try{
//         const newComment=new Comment(req.body)
//         const savedComment=await newComment.save()
//         res.status(200).json(savedComment)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
     
// })

router.post('/create',verifyToken, async(req,res)=>{
    const{ userId, comment , author ,postId  } = req.body;
    if(!(userId , comment , author ,postId ))
    {
        return res.status(400).json({ message: 'comment is required' });
    }
    // const userId =req.User.id;
    const newMessage = new Comment({ userId, comment , author ,postId  });

    await newMessage.save();
    res.json({
        message:'Data Posted Successfully', data:newMessage
    })
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json(err)
    }
})

// app.put('/putdata/:id', verifyToken, async (req, res) => {
//     const userId = req.User.id;
//     const { reg_no, department, semester_number, year } = req.body;

//     try {
//         const updatedMessage = await Messageschema.findOneAndUpdate(
//             { _id: req.params.id, userId }, // Match both message ID and user ID
//             { reg_no, department, semester_number, year }, // New data to update
//             { new: true } // To return the updated record
            
//         );
        

//         if (!updatedMessage) {
//             return res.status(404).json({ message: 'Data not found or unauthorized' });
//         }

//         res.json({ message: 'Data updated successfully', data: updatedMessage });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating data' });
//     }
// });



//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json("Comment has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})

// app.delete('/deletedata/:id', verifyToken, async (req, res) => {
//     const userId = req.User.id;

//     try {
//         const deletedMessage = await Messageschema.findOneAndDelete({
//             _id: req.params.id,
//             userId // Match both message ID and user ID
//         });

//         if (!deletedMessage) {
//             return res.status(404).json({ message: 'Data not found or unauthorized' });
//         }

//         res.json({ message: 'Data deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting data' });
//     }
// });




module.exports=router