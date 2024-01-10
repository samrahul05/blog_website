const express = require('express')
const router = express.Router()
const verifyToken = require('../verifyToken')
const User = require('../Modules/User')
const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')
const Comment=require('../Modules/comment')
const Post=require('../Modules/Post')

// const comment = require('../Modules/comment')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
//  for singup  


router.post('/signup', async(req,res)=>{
    const data = new User({
        ...req.body,
        password:bcrypt.hashSync(req.body.password,10), // for change the password into bcrypt mode 
    })
    const {emailOrphone} =req.body
    const existingUser =await User.findOne({emailOrphone})
    if(existingUser)
    {
        res.json("Email is Already Existing")
    }
    else
    {
        await data.save()
        .then(()=>{
            // console.log(data);
            res.json('Signup successfull')
        })
        .catch(()=>{
            res.json("Something Worng");
        })
    }
})

// for login 
router.post('/login',async (req,res)=>{
    const { emailOrphone, password } = req.body;
  // Find user by email
  const user = await User.findOne({ emailOrphone });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  // Check password - make sure to hash the password before checking
  const passwordMatch = await bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.json({ message: 'Invalid password' });
  }

//   res.json({ message: 'Login successful', user });
  const token = jwt.sign({id: user._id, emailOrphone: user.emailOrphone}, process.env.secretkey, // SECRETKEY is come from .env file 
       {
          expiresIn:'1h' // it tells when then code is expires
       
       });
         res.cookie('jwt', token, { httpOnly: true });
        
        return  res.json({ success: 'Login successful', token });
    
})


//LOGOUT
router.get("/logout",async (req,res)=>{
  
  try{
      res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send({ message :"User logged out successfully!"})

  }
  catch(err){
      res.status(500).json(err)
  }
})


//DELETE
router.delete("/deleteuser/:id",verifyToken,async (req,res)=>{
  try{
      await User.findByIdAndDelete(req.params.id)
      await Post.deleteMany({userId:req.params.id})
      await Comment.deleteMany({userId:req.params.id})
      res.status(200).json("User has been deleted!")

  }
  catch(err){
      res.status(500).json(err)
  }
})


const storage =multer.memoryStorage();
const upload =multer({storage: storage });

// CODE FOR POST  

// CREATE A POST 


router.post('/postupload', verifyToken,upload.single('imageUrl'), async (req, res) => {
   
  if (!req.file) {
      return res.json("no image");
  }
  const userId =req.user.id;

  cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
      }
  
      try {
    
      
        const{imageUrl ,title ,des ,username ,categories }= req.body;
        if(!( imageUrl ,title ,des ,username ,categories ))
{
    return res.status(400).json({ message: 'comment is required' });
}

const newPost = new Post({ userId, imageUrl:result.url ,title ,des ,username ,categories  });

await newPost.save();
// const sam = 
console.log(newPost)
res.json({
    message:'Data Posted Successfully', data:newPost
})

    
      // const newPost = new Post({userId, imageUrl, title, des, username, categories})
       
      } catch (err) {
        console.error('Error saving image URL to MongoDB:', err.message);
        res.status(500).json({ error: 'Error saving image URL to MongoDB' });
      }
    }).end(req.file.buffer);
  });

  
//UPDATE POST

router.put('/updatepost/:id', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const{title,des,username,categories }= req.body;

  try {
      const updatePost = await Post.findOneAndUpdate(
          { _id: req.params.id, userId }, // Match both message ID and user ID
          {title,des,username,categories },
          { new: true } // To return the updated record
          
      );
      
      console.log(updatePost)
      if (!updatePost) {
          return res.status(404).json({ message: 'Data not found or unauthorized' });
      }

      res.json({ message: 'Data updated successfully', data: updatePost });
  } catch (error) {
      res.status(500).json({ message: 'Error updating data' });
  }
});

// DELETE POST 


router.delete('/deletepost/:id', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
      const deletedPost= await Post.findOneAndDelete({_id: req.params.id,userId // Match both message ID and user ID
      });

      if (!deletedPost) {
          return res.status(404).json({ message: 'Data not found or unauthorized' });
      }

      res.json({ message: 'Data deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting data' });
  }
});



// GET  POST

router.get('/getuserposts', verifyToken, async(req,res)=>{
  const userId =req.user.id;
  // const post = await Post.find({userId})
  // res.json({ message:'Data retrieved successfully', data: post });
  
  try {
    const userPosts = await Post.find({ userId });

    res.json({ message: 'User posts retrieved successfully', data: userPosts });
} catch (error) {
    console.error('Error getting user posts:', error.message);
    res.status(500).json({ error: 'Error getting user posts' });
}
})




// for comments 
// CREATE A COMMENT UNDER A POST
router.post('/createcomment/:postId', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment, author } = req.body;

    if (!(comment && author)) {
        return res.status(400).json({ message: 'Comment and author are required' });
    }

    try {
        const newComment = new Comment({ userId, comment, author, postId });
        await newComment.save();
         console.log(newComment)
        res.json({
            message: 'Comment posted successfully',
            data: newComment
        });
    } catch (error) {
        console.error('Error posting comment:', error.message);
        res.status(500).json({ error: 'Error posting comment' });
    }
});



// GET  COMMENT

router.get('/getcomment/:postId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
      const comments = await Comment.find({ userId, postId });
      return res.status(200).json(comments);
  } catch (err) {
      console.error('Error getting comments:', err.message);
      res.status(500).json({ error: 'Error getting comments' });
  }
});
//UPDATE COMMENT

// router.put('/updatecomment/:commentId', verifyToken, async (req, res) => {
//   const userId = req.user.id;
//   const commentId = req.params.commentId;
//   const { comment, author, postId } = req.body;

//   try {
//       const updatedComment = await Comment.findOneAndUpdate(
//           { _id: commentId, userId },
//           { comment, author, postId },
//           { new: true }
//       );

//       if (!updatedComment) {
//           return res.status(404).json({ message: 'Comment not found or unauthorized' });
//       }

//       res.json({ message: 'Comment updated successfully', data: updatedComment });
//   } catch (error) {
//       console.error('Error updating comment:', error.message);
//       res.status(500).json({ error: 'Error updating comment' });
//   }
// });

// DELETE COMMENT 


router.delete('/deletecomment/:commentId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;

  try {
      const deletedComment = await Comment.findOneAndDelete({ _id: commentId, userId });

      if (!deletedComment) {
          return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
      console.error('Error deleting comment:', error.message);
      res.status(500).json({ error: 'Error deleting comment' });
  }
});




module.exports=router