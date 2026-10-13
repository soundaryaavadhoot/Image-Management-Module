var   mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const ChannelPartnerDetailsSchema = new mongoose.Schema({
    channelPartnerFamilyId : {
        type :  mongoose.Types.ObjectId,
        refs : 'channelPartnerFamily'
    } ,
     channelPartnerFamily : {
         type : String
     },
     channelPartnerName : {
         type : String
     },
     channelPartnerCode : {
         type : String
     },
    status : {
        type : Boolean,
        default: true
    },
    emailIdOne : {
        type : String,   
    },
    emailIdTwo : {
        type : String
    },
    mobileNoOne : {
        type : String
    },
    mobileNoTwo : {
        type : String
    },
    landlineOne : {
        type : String
    },
    landlineTwo : {
        type : String
    },
    adressLineOne : {
        type : String 
    },
    addressLineTwo : {
        type : String
    },
    addressLineThree : {
        type : String
    },
    location : {
        type : String 
    },
    landmark : {
        type : String
    },
    city : {
        type : String
    },
    pinCode : {
        type : String
    },
    state : {
        type : String
    },
    country : {
        type : String
    } ,  
},
{timestamps: true}
)

ChannelPartnerDetailsSchema.plugin(aggregatePaginate);
ChannelPartnerDetailsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('channelPartnerDetails' , ChannelPartnerDetailsSchema)