var   mongoose = require("mongoose");


const userDataSchema = new mongoose.Schema(
    {
         profileimgName : {
            type: String 
         },
         profileimgPath : {
            type: String 
         },
         aadharCardimgName : {
            type: String 
         },
         aadharCardimgPath : {
            type: String 
         },
         panCardimgName : {
            type: String 
         },
         panCardimgPath : {
            type: String 
         },
         uniqueId : {
            type : String,
         }
    },
    { timestamps: true }
);

module.exports = mongoose.model('userData' , userDataSchema);