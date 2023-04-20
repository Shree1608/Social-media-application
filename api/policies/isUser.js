const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();


module.exports = async(req , res ,next)=>{
    try{
       
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token , process.env.JWT_KEY)
        const finduser = await User.findOne({id : decoded.userId})
        if(token == finduser.token){
            req.userData = decoded; 
            return next();
        }else{
            res.status(401).json({
                message : 'token invalid'
            })
        }
    }catch(error){
        res.status(401).json({
            message : 'Auth Failed'
        });
    }
}