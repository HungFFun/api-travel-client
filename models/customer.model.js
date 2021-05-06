var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var CustomerSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
      default: null,
    },
    birthday: {
      type: Date,
      require: true,
      default: null,
    },
    phone: {
      type: String,
      require: true,
      default: null,
    },
    email: {
      type: String,
      require: true,
      default: null,
    },
    identityCard: {
      type: String,
      require: true,
      default: null,
    },
    address: {
      type: String,
      require: true,
      default: null,
    },
    password: {
      type: String,
      default: '123456',
    },
    activationStatus: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      require: true,
      default: null,
    },
  },
  { versionKey: false }
);
CustomerSchema.index(
  {
    phone: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

CustomerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('customer', CustomerSchema, 'customers');
