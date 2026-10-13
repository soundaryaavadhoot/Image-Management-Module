var   mongoose = require("mongoose");


const userProfileSchema = new mongoose.Schema(
    {
        imgName : {
            type: String 
         },
         imgPath : {
            type: String 
         },
         uniqueId : {
            type : String,
         }
    },
    { timestamps: true }
);

module.exports = mongoose.model('userprofile' , userProfileSchema);