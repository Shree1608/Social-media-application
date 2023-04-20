/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const PostController = require("../api/controllers/PostController");
const UserController = require("../api/controllers/UserController");






module.exports.routes = {

    // Admin Controller
    'POST /admin/signup' : 'AdminController.signup',
    'POST /admin/login' : 'AdminController.login',
    'POST /admin/logout' : 'AdminController.logout',
    'POST /admin/user/status/:id' :'AdminController.update_userStatus',

    // User Controller   
    'POST /user/signup' : 'UserController.signup',
    'POST /user/otpgenerate' : 'UserController.otp_generate',
    'POST /user/verifyotp/setpassword': 'UserController.verifyOtp_changePassword',
    'POST /user/login' : 'UserController.login',
    'POST /user/logout' : 'UserController.logout',
    'PATCH /user/acctype':'UserController.update_accTyp',
    'GET /users' :'UserController.listUser',
    'GET /users/:name' : 'UserController.search_user',
    'PATCH /user' : 'UserController.update_profile',
    'DELETE /user/pic/:id' : 'UserController.remove_pic',
    'GET /user/finduser/:id' :'UserController.find_user',

    //Post Controller
    'POST /user/post' : 'PostController.create_post',
    'DELETE /user/post/delete/:id' :'PostController.delete_post',
    'PATCH /user/post/edit/:id' :'PostController.update_post',
    'GET /user/allpost/:id' : 'PostController.list_post',
    'GET /user/searchpost/:id/:text' : 'PostController.search_post',

    //Like Controller
    'POST /user/post/like/:id' : 'LikeController.like_unlike',

    //Comment controller
    'POST /post/comment/:id' :'CommentsController.add_comment',
    'DELETE /post/comment/:id' : 'CommentsController.delete_comment',
    'PATCH /post/comment/:id' : 'CommentsController.update_comment',

    //Following Controller
    'POST /user/following/:id' : 'FollowingController.follow_unfollow',
    


};
