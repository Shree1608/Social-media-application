/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const bcrypt = require('bcrypt');





module.exports = {
  
    signup : async(req,res)=>{
        const {adminName , email , password , confirmPass } = req.body
        const findAdmin = await Admin.findOne({email:email})
        if(findAdmin){
            res.status(401).json({message :'email alredy exists'})
        }else{
            if(password !== confirmPass){
                res.status(400).json({message :'password is not match with confirm password'})
            }else{
                    const img= await sails.helpers.image(req ,'admin/profile','profilePic')
                    if(data != ' '){
                        if(!data.type.includes('image/'))
                        {
                             return res.status(500).json({message :'You can only upload imag'})
                        }   
                     }         
                        const hash = await bcrypt.hash(password ,10)
                        console.log(img);
                        const Adminsignup =  await Admin.create({
                            adminName : adminName,
                            email:email,
                            password:hash,
                            profilePic :img.fd
                        })
                       return res.status(200).json({meassage :'Admin signup successfully'})     
            }
        }
    },

    login : async(req,res)=>{
        const { email , password} = req.body 
        const findAdmin = await Admin.findOne({email})
        if(!findAdmin){
            res.status(404).json({message :'invalid email or email not exist'})
        }else{
            const matchPassw = await bcrypt.compare(password , findAdmin.password)
            if(!matchPassw){
                res.status(500).json({message : 'password invalid'})
            }else{
            const token = jwt.sign({
                    adminId : findAdmin.id ,
                    email: findAdmin.email
                },process.env.JWT_KEY ,{
                    expiresIn :'24h'
                });
            const updateAdmin = await Admin.updateOne({id :findAdmin.id},{token:token})
            res.status(200).json({
                message : 'Authentication Successful',
                token : token
            })
            }
           
        }
    },

    logout : async(req,res)=>{
        const findAdminId = req.adminData.adminId;
        const findadmin = await Admin.updateOne({id:findAdminId},{token :null})
        res.status(200).json({message :'logout successfully'})
    },
    update_userStatus : async(req,res)=>{
        const userId = req.params.id
        let status_type
        const finduser = await User.findOne({id:userId})
        if(!finduser){
            return res.status(404).json({message :'user not found'})
        }else{
            if(finduser.status == 'A'){
                status_type = 'I'
            }else{
                status_type = 'A'
            }
            const updateStatus = await User.updateOne({id:userId}).set({status : status_type})
            res.status(200).json({message :`user is now ${status_type}`})
        }
    }
    
  

};

