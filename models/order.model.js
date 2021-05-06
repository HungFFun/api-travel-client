var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

var OrderSchema = mongoose.Schema({
    orderCode:{
        type:String
    },
    orderDate:{
        type:Date,
        default: new Date()
    },
    listOrderDetail:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderDetail",
    }],
    seatDetail:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "seatDetail",
    },
    total:{
        type:Number
    }
},{ versionKey: false });
OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order',OrderSchema,'orders');