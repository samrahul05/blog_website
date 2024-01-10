

const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) =>{
    const token = req.cookies.jwt;

    if(!token)
    {
        return res.status(401).json({ message: 'Authentication required' });
    }
    jwt.verify(token,process.env.secretkey,(err,decoded) =>{
        if(err)
        {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        // console.log(req.user)
        // console.log(req.User);
        // res.json('Authentication successfull')
        next()
    })
}
module.exports=verifyToken;  










