/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
let otp
// const User = require('../models/User')

module.exports = {
    signup : async(req,res)=>{
        const {name,userName , email , password , confirmPass,accountTyp } = req.body
        const findUserName = await User.findOne({userName:userName})
        const finduser = await User.findOne({email:email})
        if(finduser){
            res.status(401).json({message :'email alredy exists'})
        }else{
            if(findUserName){
                res.status(500).json({message :'this name is aleady exists'})
            }else{
                if(password !== confirmPass){
                    res.status(400).json({message :'password is not match with confirm password'})
                }else{
                    
                        const data = await sails.helpers.image(req,'pic','profile_pic')
                        if(data != ' '){
                            if(!data.type.includes('image/'))
                            {
                                 return res.status(500).json({message :'You can only upload imag'})
                            }   
                        }
                        const hash = await bcrypt.hash(password ,10)
                        const usersignup =  await User.create({
                            name:name,
                            userName : userName,
                            email:email,
                            password:hash,
                            accountTyp:accountTyp,
                            profile_pic : data.fd      
                        })
                        return res.status(200).json({meassage :'user signup successfully'})
                        
                        
                            
                       
                }
            }   
        }
    },
    otp_generate : async(req,res)=>{
        const {email,enter_otp} = req.body
        const finduser = await User.findOne({email:email})
        console.log(finduser);
        if(!finduser){
            return res.status(404).json({message :'invalid email or email not exist'})
        }else{
            console.log(finduser.token+ 'jhj');
            if(finduser.token == ''){
                otp = otpGenerator.generate(6,{ digits:true,lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false});
                console.log(otp);
                const otpsend = await User.updateOne({id:finduser.id}).set({otp:otp })
                setTimeout(async function() {
                    const otpsend = await User.updateOne({id:finduser.id}).set({otp:0})
                }, 120000);
                let transport = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "1cdc869c523074",
                      pass: "00f22468556082"
                    }
                  });
                  const info = {
                    from: '"bhagyashree"<bhagyashreec@zignuts.com>', // sender address
                    to: email, 
                    subject: "password reset otp   ✔", 
                    text: `password reset your otp is ${otp} `,
                    html: `password reset your otp is ${otp} `, 
                  };
                  
                  transport.sendMail(info) ;
                return res.status(200).json({otp:otp,message :'you otp is expire after 2 minit'})   
            }else{
                res.status(500).json({message :'user already login'})
            }
        }
    },
    verifyOtp_changePassword : async(req,res)=>{
        const {email ,enter_otp,password} = req.body
        const finduser = await User.findOne({email:email})
        if(!finduser){
            res.status(500).json({message :'user not found'})
      }else{
              if(otp == enter_otp){
                  await sails.helpers.sendmail(email)
                  const updatePass = await User.updateOne({id:finduser.id}).set({password:password,otp :0})
                  console.log(updatePass);
                 return res.status(200).json({message : 'password change'})
              }
              else{
                  return res.status(200).json({message : 'password not change'})
              }
      }   
    },
    login : async(req,res)=>{
        const { email , password} = req.body 
        const finduser = await User.findOne({email:email,status :'A'})
        if(!finduser){
            res.status(404).json({message :'invalid email or email not exist'})
        }else{
            const matchPassw = await bcrypt.compare(password , finduser.password)
            if(!matchPassw){
                res.status(500).json({message : 'password invalid'})
            }else{
            const token = jwt.sign({
                    userId : finduser.id ,
                    email: finduser.email
                },process.env.JWT_KEY ,{
                    expiresIn :'24h'
                });
            const updateuser = await User.updateOne({id :finduser.id},{token:token})
            res.status(200).json({
                message : 'Authentication Successful',
                token : token
            })
            }
           
        }
    },
    logout : async(req,res)=>{
        const finduserId = req.userData.userId;
        const finduser = await User.updateOne({id:finduserId},{token :" "})
        res.status(200).json({message :'logout successfully'})
    },
    update_accTyp : async(req,res)=>{
        const userId = req.userData.userId
        const finduser = await User.find({id:userId})
        console.log(finduser);
        if(!finduser){
            res.status(404).json({message :'user not found'})
        }else{
            console.log(finduser[0].accountTyp);
            if(finduser[0].accountTyp =='pr'){
                const updateacctopu = await User.updateOne({id:userId}).set({accountTyp :'pu'})
                res.status(200).json({message :'your account is now public'})
            }else{
               
                const updateacctopr = await User.updateOne({id:userId}).set({accountTyp :'pr'})
                res.status(200).json({message :'your account is now private'})
               }  
            
           
        }
    },
    listUser : async(req,res)=>{
       const admin = req.adminData.adminId
       const findadmin = await Admin.findOne({id:admin})
       const user = await User.find({}).omit(['password','token'])
       res.status(200).json({
        admin : findadmin.adminName,
        users :user
       }) 
    },
    search_user : async(req,res)=>{
        const admin = req.adminData.adminId
        const findadmin = await Admin.findOne({id:admin}) 
        const finduser = await User.find({where :{
            or:[

               { name :{
                    'like' :'%' + req.param('name') +'%'
                }},
                {userName :{
                    'like' :'%' + req.param('name') +'%'
                }}
            ]
        }
            

        })
        res.status(200).json({message :'search' ,admin : findadmin.adminName, user :finduser})
    },
    update_profile : async(req,res)=>{
        const id = req.userData.userId
        let {name,userName}= req.body
        let user = await User.findOne({id:id})
        if(userName == null ){
            userName = user.userName
        } else {
           const  username = await User.findOne({userName:userName})
           if(username) {
            return res.status(409).json({
                message :'userName already exist'
            })
           }
           userName = userName
        }
        
            let uploadpic = await sails.helpers.image(req,'pic','profile_pic') 
            if(uploadpic == " "){
                 uploadpic = user.profile_pic
            }
                const updatepic = await User.updateOne({id:id}).set(req.body)
                res.status(200).json({message:'updated',user:updatepic})
    },
    remove_pic: async(req,res)=>{
        const user = req.params.id
        const finduser = await User.findOne({id:user})
        if(finduser.profile_pic === ' '){
            res.status(404).json({
                message:" photo not found"
            })
        }else{
            const deletepic = await User.updateOne({id:user}).set({profile_pic :" "})
            console.log(deletepic);
            res.status(200).json({message :'delete'})
        }
       
    },
    find_user : async(req,res)=>{
       const userId = req.params.id
       const finduser = await User.findOne({id:userId,status :'A'}).populate('followings').populate('follower')
       if(finduser){
           return res.status(200).json({message :'ok',user:finduser})
       }else{
           return res.status(200).json({message :'user not found'})
       }

    }
    
 
};

