/**
 * CommentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */






module.exports = {
    add_comment : async(req,res)=>{
        const user = req.userData.userId
        const finduser = await User.find({id:user,status :'A'})
        const postId  = req.params.id
        const {comments} = req.body
        const findpost = await Post.find({id:postId,isDeleted:false})
        if(!findpost){
         res.status(404).json({message :'post not found'})
        }else{
            const postcomment = await Comments.create({
                  comments:comments,
                  user:user,
                  post:postId
            }).fetch()
            const post = await Post.findOne({id:postId}).populate('comments')
            console.log(post);
            res.status(200).json({
                message :'comment!!',
                post:post
            })
        }
    },
    delete_comment : async(req,res)=>{
        const commentId = req.params.id
        const findcomment = await Comments.findOne({id:commentId,isDeleted:false})
        if(!findcomment){
           res.status(404).json({message :'comment not found'})
        }else{
            const deletecomment = await Comments.updateOne({id:commentId}).set({isDeleted:true,deletedAt :Date.now()})
            res.status(200).json({message :'deleted!!!'})
        }
        
    },
    update_comment : async(req,res)=>{
        const commentId = req.params.id
        const {comments} = req.body 
        const findcomment = await Comments.findOne({id:commentId,isDeleted:false})
        if(!findcomment){
           res.status(404).json({message :'comment not found'})
        }else{
            const editcomment = await Comments.updateOne({id:commentId}).set({comments:comments,updatedAt :  new Date().toLocaleString()})
            res.status(200).json({message :'deleted!!!',comment:editcomment})
        }

    }

};

