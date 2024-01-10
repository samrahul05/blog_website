
// User Schema validation 

const mongoose = require('mongoose')

const UserValidation = new mongoose.Schema({
    name:String,
    emailOrphone:String,
    password:String
})
module.exports=mongoose.model('User_detail',UserValidation)