
// Pst section Schema validation 

const mongoose = require('mongoose')

const PostValidation = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_detail',
      },
    title:String,
    des:String,
    imageUrl:String,
    username:String,
    categories:String
})
module.exports=mongoose.model('Post',PostValidation)


