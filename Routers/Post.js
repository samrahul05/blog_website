// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');


// const verifyToken =require('../verifyToken')




// router.post('/upload', upload.single('imageUrl'), async (req, res) => {
//     if (!req.file) {
//         return res.json("no image");
//     }

//     cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
//         }
    
//         try {
        
//           const newPost = new Post({ 
            
//             imageUrl: result.url,
//             title: req.body.name,
//             des: req.body.price,
//             username: req.body.description,
//             categories: req.body.category,
//          }); 
//           await newPost.save();
//           console.log(newPost)
//           res.json("image is Send successfully");
//         } catch (err) {
//           console.error('Error saving image URL to MongoDB:', err.message);
//           res.status(500).json({ error: 'Error saving image URL to MongoDB' });
//         }
//       }).end(req.file.buffer);
//     });
