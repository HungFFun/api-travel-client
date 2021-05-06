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

http.listen(process.env.PORT || 8000, function () {
  console.log(`listening on :${process.env.PORT}`);
});
