var   mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const ChannelPartnerBankDetailsSchema = new mongoose.Schema({
    nameOfAccountHolder : {
        type : String
    },
    typeofAccount : {
        type : String
    },
    bankName : {
        type : String
    },
    branchWithAdress : {
        type : String 
    },
    ifscCode : {
        type : String
    },
    accountNo : {
        type : String
    }
})

ChannelPartnerBankDetailsSchema.plugin(aggregatePaginate);
ChannelPartnerBankDetailsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ChannelPartnerBankDetails' , ChannelPartnerBankDetailsSchema)