var   mongoose = require("mongoose");
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoosePaginate = require('mongoose-paginate-v2');

const corporateSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Types.ObjectId,
        },
        corporateType : {
            type : String
        },
        corporateDescription : {
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

corporateSchema.plugin(aggregatePaginate);
corporateSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('corporate' , corporateSchema)