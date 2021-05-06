var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

var OrderDetailSchema = mongoose.Schema({
    amount: {
        type: Number
    },
    price: {
        type: Number
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    totalPrice: {
        type: Number
    }
}, { versionKey: false });
OrderDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('orderDetail', OrderSchema, 'orderDetails');