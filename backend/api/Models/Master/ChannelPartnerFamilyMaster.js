var   mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const channelPartnerFamilySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
    },
    channelPartnerFamilyName : {
        type : String
    },
    channelPartnerFamilyDescription : {
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
)

channelPartnerFamilySchema.plugin(aggregatePaginate);
channelPartnerFamilySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('channelPartnerFamily' , channelPartnerFamilySchema)