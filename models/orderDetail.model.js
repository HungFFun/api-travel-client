var mongoose = require('mongoose');
var product = require('./product.model');
const mongoosePaginate = require('mongoose-paginate-v2');

var OrderDetailSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: product,
    },
    totalPrice: {
      type: Number,
    },
  },
  { versionKey: false }
);
OrderDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(
  'orderDetail',
  OrderDetailSchema,
  'orderDetails'
);
