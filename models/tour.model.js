var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var TourSchema = mongoose.Schema(
  {
    tourId: {
      type: String,
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      require: true,
    },
    numberOfParticipants: {
      type: Number,
      required: true,
      default: 40,
    },
    priceDetail: {
      adult: {
        type: Number,
        require: true,
      },
      underTheAgeOfTwelve: {
        type: Number,
      },
      underTheAgeOfFive: {
        type: Number,
      }
    },
    typesOftourism: {
      type: String,
      required: true,
    },
    seatStatus: {
      type: String,
      default: "Còn Chỗ",
    },
    startPlace: {
      type: String,
      required: true,
      default: "HCM",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    listImage: [
      {
        type: String,
      }
    ],
    place: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "place",
      }
    ],
    hotel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hotel",
      }
    ],
    transportation: [
      {
        type: String,
      }
    ],
    detail: [
      {
        type: String,
      }
    ],
    numDay:[
      {
        type:String,
      }
    ],
    rate:{
      type:String
    },
    surcharge:{
      type:Number,
      default:1000000
    },
    numberTicket:{
      type:Number,
      default:40
    }
  },
  { versionKey: false }
);
TourSchema.index(
  {
    tourId: 1,
  },
  {
    unique: true,
  }
);

TourSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("tour", TourSchema, "tours");
