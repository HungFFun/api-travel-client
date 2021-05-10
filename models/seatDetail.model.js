var mongoose = require('mongoose');
var tour = require('./tour.model');
var customer= require('./customer.model')
const mongoosePaginate = require('mongoose-paginate-v2');

var SeatDetailSchema = mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tour,
    },
    listCutomerTour: [
      {
        nameCustomer: {
          type: String,
        },
        birthDay: {
          type: Date,
        },
        gender: {
          type: String,
        },
        typeOfTicket: {
          type: String,
        },
      },
    ],
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: customer,
    },
    amountRoom: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
  },
  { versionKey: false }
);
SeatDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('seatDetail', SeatDetailSchema, 'seatDetails');
