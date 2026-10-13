var   mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const channelPartnerTypeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
    },
    channelPartnerTypeName : {
        type : String
    },
    channelPartnerTypeDescription : {
        type: String
    },
    isActive : {
        type : Boolean,
        default: true
    },
    isPublished:{
        type: Boolean,
        default:true   
    }
},
{timestamps: true}
);

channelPartnerTypeSchema.plugin(aggregatePaginate);
channelPartnerTypeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('channelPartnerType' , channelPartnerTypeSchema)