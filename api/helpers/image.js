

const dotenv = require("dotenv").config();
module.exports = {


  friendlyName: 'Image',


  description: 'Image something.',


  inputs: {
       req :{
        type :'ref'
       },
      
       folder :{
        type : 'string'
       },
       file :{
        type :'string'
       },
       
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs,res) {
    let profilefd
    let data = await new Promise(async(Resolve,Reject)=>{
     const uploads = await inputs.req.file(inputs.file).upload({
        maxBytes : 10000000,
        saveAs: function(file, cb) {
          cb(null, file.filename);
        },
        dirname:inputs.folder
       
    },async function whenDone(err , uploadedFiles){
        if(err){
            return Reject(err)
        }
        if(uploadedFiles.length == 0){
          profilefd =" "
            return Resolve(profilefd)
        }else{
          try{
            profilefd = uploadedFiles[0]
              return Resolve(profilefd) 
          }catch(err){
            Reject(err)
          }
        }
    })
    })
    return data
     

}
}
