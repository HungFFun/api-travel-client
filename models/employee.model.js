var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var EmployeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    fullName: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    dateOfbirth: {
      type: Date,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    activationStatus: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);
EmployeeSchema.index(
  {
    employeeId: 1,
  },
  {
    unique: true,
  }
);

EmployeeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('employee', EmployeeSchema, 'employees');
