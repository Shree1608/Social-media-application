/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name : {
      type :'string',
      required :true,
    },
    userName :{
      type :'string',
      unique : true,
      required : true,
    },
    email :{
      type :'string',
      required : true,
    },
    password :{
      type: 'string',
      required : true
    },
    profile_pic : {
      type :'string',
      required:false
    },
    accountTyp:{
       type:'string',
       isIn : ['pr','pu'],
       defaultsTo :'pu'
    },
    post:{
       type:'number',
       defaultsTo : 0
    },
    following :{
       type :'number',
       defaultsTo : 0
    },
    followers :{
      type :'number',
      defaultsTo : 0
   },
   status :{
    type :'string',
    isIn :['A','I'],
    defaultsTo :'A'
   },
   otp :{
    type :'number',
   },
   token:{
    type :'string',
    
   },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    followings :{
      collection:'following',
      via:'followingid'
    },
    follower:{
      collection :'following',
      via:'follow'
    }

  },

};

