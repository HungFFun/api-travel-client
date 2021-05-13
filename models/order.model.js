var mongoose = require('mongoose');
const seatDetail = require('./seatDetail.model');
const orderDetail = require('./orderDetail.model');
const mongoosePaginate = require('mongoose-paginate-v2');

var OrderSchema = mongoose.Schema(
  {
    orderCode: {
      type: String,
    },
    orderDate: {
      type: Date,
      default: new Date(),
    },
    orderDetail: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: orderDetail,
      },
    ],
    seatDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: seatDetail,
    },
    total: {
      type: Number,
    },
    statusOrder:{
      type:Boolean,
      default:false
    }
  },
  { versionKey: false }
);
OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order', OrderSchema, 'orders');
