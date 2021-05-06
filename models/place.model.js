var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

var PlaceSchema = mongoose.Schema({
    placeName:{
        type: String,
        required:true,
    },
    type:{
        type: String
    },
    city:{
        type : String
    },   
    district:{
        type: String
    },
    apartmentNumber:{
        type: String
    }
},{ versionKey: false });
PlaceSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('place',PlaceSchema,'places');