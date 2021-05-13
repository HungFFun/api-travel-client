var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./config/db');
const customerRouter = require('./routes/customer.router');
const tourRouter = require('./routes/tour.router');
const productRouter = require('./routes/product.router');
const accountRouter = require('./routes/account.router');
const orderRouter = require('./routes/order.router');
const sentMailRouter = require('./routes/sentMail.router');

const order = require('./models/order.model')
const seatDetail = require('./models/seatDetail.model')
const tour = require('./models/tour.model')
const orderDetail = require('./models/orderDetail.model')

const fileUpload = require('express-fileupload');
require('dotenv').config();

db.connectWithRetry();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 1000 * 1024 * 1024 },
  })
);

app.use('/', customerRouter);
app.use('/', tourRouter);
app.use('/', productRouter);
app.use('/', accountRouter);
app.use('/', sentMailRouter);
app.use('/', orderRouter);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
async function cancelOrder() {
  setTimeout(async function () {
    try {
      var currDate = new Date()
      currDate.setDate(currDate.getDate() - 1)
      console.log(currDate);
      const getListOrder = await order.find({}).where('orderDate').gte(currDate)
      for (let index = 0; index < getListOrder.length; index++) {
        const getSeatDetail = await seatDetail.findOne({ _id: getListOrder[index].seatDetail });
        const getTour = await tour.findOne({ _id: getSeatDetail.tourId });
        getTour.seatStatus = "Còn Chỗ";
        getTour.numberTicket = getTour.numberTicket + getSeatDetail.listCutomerTour.length;
        tour.findByIdAndUpdate({ _id: getTour._id },
          { $set: { numberTicket: getTour.numberTicket, seatStatus: getTour.seatStatus } }).then((value) => {
            console.log("Update tour thành công");
          })
        seatDetail.findByIdAndDelete({ _id: getSeatDetail._id }).then((value) => {
          console.log("Delete seat Detail thành công");
        })
        for (let i = 0; i < getListOrder[index].listOrderDetail.length; i++) {
          const element = getListOrder[index].listOrderDetail[i];
          orderDetail.findByIdAndDelete({ _id: element._id }).then((value) => {
            console.log("Delete order Detail thành công");
          })
        }
        order.findByIdAndDelete({ _id: getListOrder[index]._id }).then((value) => {
          console.log("Delete order thành công");
        })
      }
      cancelOrder();
    } catch (error) {
      console.log('cancel tour Error');
    }
  },86400000);
}
http.listen(process.env.PORT || 8000, function () {
  // cancelOrder()
  console.log(`listening on :${process.env.PORT}`);
});
