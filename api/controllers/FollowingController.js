/**
 * FollowingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */






module.exports = {
    follow_unfollow : async(req,res)=>{
        const followingid = req.userData.userId
        const finduser = await User.find({id:followingid,status :'A'})
        const follow = req.params.id
        const findfollowinguser = await User.find({id:follow,status :'A'})
        if(!findfollowinguser){
            res.status(200).json({message :'user not found'})
        }else{
            const findfollowid = await Following.findOne({follow:follow,followingid:followingid})
            console.log(findfollowid);
            if(findfollowid){
                const updatefolowing = await User.updateOne({id:followingid}).set({following :findfollowinguser[0].following - 1})
                const updateFollower = await User.updateOne({id:follow}).set({followers : finduser[0].followers - 1})
                const deletefollowid = await Following.destroyOne({id:findfollowid.id})
                res.status(400).json({message :'unfollow'})
            }else{
                const follwingId = await Following.create({
                    followingid:followingid,
                    follow:follow
                }).fetch()
                const updatefolowing = await User.updateOne({id:followingid}).set({following :findfollowinguser[0].following + 1})
                const updateFollower = await User.updateOne({id:follow}).set({followers : finduser[0].followers + 1})
                res.status(200).json({message :'followed'})
            }
            
        }
    }
};

