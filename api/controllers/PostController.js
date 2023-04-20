/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    create_post : async(req,res)=>{
        const user = req.userData.userId
        const finduser = await User.findOne({id:user,status :'A'}) 
        const {text ,content,img_video} = req.body 
        const file = await sails.helpers.image(req,'post','img_video')
        const addpost = await Post.create({
            user:user,
            text :text,
            content:content,
            img_video:file.fd,  
        }).fetch()
        res.status(200).json({message : 'post created',post : addpost})
        const updatUserpost = await User.updateOne({id:user}).set({post : finduser.post + 1})
    },
    update_post : async(req,res)=>{
       const user = req.userData.userId
       const finduser = await User.findOne({id:user,status :'A'})   
       const postId = req.params.id
       const { text,content} = req.body
       const findPost = await Post.find({id:postId,isDeleted:false})
       if(!findPost){
        res.status(404).json({message :'post not found'})
       }else{
        const updatePost = await Post.updateOne({id:postId}).set({text:text,content:content,updatedAt : new Date().toLocaleString()})
        res.status(200).json({
            message:'updated!!',
            post :updatePost
        })
       }
             
    },
    delete_post : async(req,res)=>{
      const user = req.userData.userId
      const finduser = await User.findOne({id:user,status :'A'})
      const postId  = req.params.id
      const findPost = await Post.find({id:postId,isDeleted:false})
      if(!findPost){
       res.status(404).json({message :'post not found'})
      }else{
       const updatePost = await Post.updateOne({id:postId}).set({isDeleted:true,deletedAt : new Date().toLocaleString()})
       const updatUserpost = await User.updateOne({id:user}).set({post : finduser.post - 1})
       res.status(200).json({
           message:'deleted!!',
           post :updatePost
       })
      }
    },
    list_post : async(req,res)=>{
        const user = req.userData.userId
        const findUser = await User.find({id:user,status :'A'})
        const otherUserId = req.params.id
        const otherUser = await User.find({id:otherUserId,status :'A'})
        if(!findUser){
            return res.status(404).json({message :'user not found'})
        }else{
            if(!otherUser){
                return res.status(404).json({message :'user not found'})  
            }else{
                if(otherUser[0].accountTyp == 'pu'){
                    const listPost = await Post.find({isDeleted:false})
                    return res.status(200).json({user:user,message :'all post',total_Post:listPost.length,post:listPost})
                }else{
                    if(otherUser[0].accountTyp == 'pr'){
                        const findFollower = await Following.findOne({follow : otherUserId ,followingid :user})
                        if(findFollower){
                            const listPost = await Post.find({isDeleted:false})
                            return res.status(200).json({user:user,message :'all post',total_Post:listPost.length,post:listPost}) 
                        }
                    }
                            return res.status(500).json({message :'this account is private'})
                }
            }
            
            
        }
    },
    search_post : async(req,res)=>{
        const user = req.userData.userId
        const finduser = await User.find({id:user,status :'A'})
        if(!finduser){
            return res.status(404).json({message :'user not found'})
        }else{
            const otherUserId = req.params.id
            const findfollowinguser = await User.find({id:otherUserId,status :'A'})
            if(!findfollowinguser){
                res.status(200).json({message :'user not found'})
            }else{
                if(findfollowinguser[0].accountTyp == 'pu'){
                    const searchpost = await Post.find({where :{isDeleted:false,
                        or :[
                            {
                                text :{
                                    'like' : '%' + req.param('text') + '%'
                                }
                            },
                            {
                                content :{
                                    'like' : '%' + req.param('text') + '%'
                                }
                            }
                        ]
                    }})
                    return res.status(200).json({
                        message :'search',
                        whoes_post :finduser[0].userName,
                        who_search : findfollowinguser[0].userName,
                        post: searchpost
                    })
                }else{
                    if(findfollowinguser[0].accountTyp == 'pr'){
                        const findfollowid = await Following.findOne({follow:otherUserId,followingid:user})
                        if(findfollowid){
                     
                            const searchpost = await Post.find({where :{isDeleted:false,
                                or :[
                                    {
                                        text :{
                                            'like' : '%' + req.param('text') + '%'
                                        }
                                    },
                                    {
                                        content :{
                                            'like' : '%' + req.param('text') + '%'
                                        }
                                    }
                                ]
                            }})
                            return res.status(200).json({
                                message :'search',
                                whoes_post :finduser[0].userName,
                                who_search : findfollowinguser[0].userName,
                                post: searchpost
                            })
                        }else{
                            return res.status(500).json({message :'this account is private'})
                        }  
                    }
                }
                
            }
        }
        
    },
    

    

};

