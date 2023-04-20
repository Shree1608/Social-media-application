/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  AdminController :{
    logout :'isAdmin',
    update_userStatus:'isAdmin'

  },
  UserController :{
    logout :'isUser',
    
    update_accTyp:'isUser',
    listUser :'isAdmin',
    find_user:'isAdmin',
    search_user :'isAdmin',
    update_profile:'isUser',
    remove_pic :'isUser',
  },
  PostController :{
    create_post :'isUser',
    update_post:'isUser',
    delete_post:'isUser',
    list_post:'isUser',
    search_post:'isUser',
    
  },
  LikeController :{
    like_unlike :'isUser'
  },

  CommentsController : {
    add_comment :'isUser',
    delete_comment :'isUser',
    update_comment :'isUser'
  },

  FollowingController :{
    follow_unfollow :'isUser'
  }

};
