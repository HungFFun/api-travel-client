var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

var HotelSchema = mongoose.Schema({
    hotelName:{
        type: String,
        required:true,
    },
    phone:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    city:{
        type : String,
        required : true
    },
    quality:{
        type: Number,
    }
},{ versionKey: false });

HotelSchema.index({
    hotelName: 1,
    email: 1,
    SDT:1,
  }, {
    unique: true,
});

HotelSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('hotel',HotelSchema,'hotels');