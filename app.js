// requirinng packages 

const express    = require('express')
const app        = express()
const bcrypt     = require('bcrypt')
const cors       = require('cors')
const CookieParser = require('cookie-parser');
const jwt        = require('jsonwebtoken')
const mongoose   = require('mongoose')
const multer     = require('multer')
const path       = require('path')
const { ServerResponse } = require('http')
const cloudinary = require('cloudinary').v2;
const verifyToken = require('./verifyToken')
// const multer = require('multer');
require('dotenv').config()

// mongobd connection 

mongoose.connect(process.env.DBURL)
.then(()=>{
   console.log("DB is connected");
})
.catch(()=>{
    console.log("DB is not connected");
})

// cloudinary connection for image 


cloudinary.config({
    cloud_name:'dkfqlbmbw',
    api_key:'156486712375679',
    api_secret:'vz4LKcuFYAiBNbX_H6-i_p1hus4',
    secure:true,
})

const storage =multer.memoryStorage();
const upload =multer({storage: storage });


// middlewares

app.use(express.urlencoded({extent:false}))
app.use(express.json())
app.use(cors())
app.use(CookieParser());


// modules 

const accessrouter= require('./Routers/Permission')
// const profilerouter =require('./Routers/User')
// const commentrouter =require('./Routers/Comment')
// const Post=require('./Modules/Post')




// Servers 


app.use('/api/Permission',accessrouter)
// app.use('/api/User', profilerouter )
// app.use('/api/Comment',commentrouter)

// port server 
app.listen(process.env.PORT,()=>{
    console.log("Server is Running:",process.env.PORT);
})