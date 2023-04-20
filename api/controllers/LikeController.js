/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {
  
    like_unlike : async(req,res)=>{
       const user = req.userData.userId
       const postId = req.params.id
       console.log(postId);
       const findpost = await Post.findOne({id:postId,isDeleted:false})
      
       if(!findpost){
        res.status(404).json({message :'post not found'})
       }else{
        const likefind = await Like.findOne({user:user,post:postId})
        if(likefind){
            const unlike = await Post.updateOne({id:postId}).set({like:findpost.like - 1})
            const deletelike = await Like.destroyOne({id:likefind.id}) 
            return res.status(200).json({message :'okk'})
        }else{
            const dolike = await Like.create({user :user,post:postId}).fetch()
            const post = await Post.updateOne({id:postId,isDeleted:false}).set({like:findpost.like + 1})
            return res.status(200).json(post)
        }
        }
    }
        
       
       
       
    

};

