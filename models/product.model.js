var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

var ProductSchema = mongoose.Schema({
    productCode:{
        type:String,
        required:true
    },
    productName:{
        type: String,
        require: true
    },
    image:{
        type: String,
    },
    price:{
        type: String,
        require: true
    },
    quantity:{
        type: Number,
        required: true
    },
    typesOftourism:[{
        type: String,
        require: true
    }],
    description:{
        type:String,
        required:true
    }
},{ versionKey: false });

ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('product',ProductSchema,'products');