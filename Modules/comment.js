
// Comment section Schema validation 

const mongoose = require('mongoose')

const CommentValidation = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_detail',
      },
    postId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Post'
    },
    comment:String,
    author:String,
    
    // userId:String,
  
})
module.exports=mongoose.model('Comment',CommentValidation)