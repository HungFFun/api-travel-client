var order = require('../models/order.model');
var customer = require('../models/customer.model');
var seatDetail = require('../models/seatDetail.model');
var ORDERCONSTANT = require('../constants/order.constant');
var CUSTOMERCONSTANT = require('../constants/customer.constant');
var moment = require('moment');

const getAllOrder = async (req, res) => {
  try {
    const listOrder = await order
      .find({})
      .populate(['orderDetail', 'seatDetail']);
    if (listOrder !== null) {
      res.status(200).send(listOrder);
    }
    res.status(200).send({ message: ORDERCONSTANT.NOT_FIND_ORDER });
  } catch (error) {
    res.status(500).send({ message: ORDERCONSTANT.SYSTEM_ERROR });
  }
};

const createOrderForCustomer = async (req, res) => {
  try {
    const {
      tour,
      customer,
      productCart,
      inforBooking,
      inforAdults,
      inforChildren,
      inforYoung,
    } = req.body;

    console.log('------ ------tour được chon -----------');
    console.log(tour);
    console.log('-------------- thông tin liên lạc người đăng ký-----------');
    console.log(customer);
    console.log('-------------- sản phẩm được chọn mua-----------');
    console.log(productCart);
    console.log(
      '-------------------thông tin booking----------------------------------------'
    );
    console.log(inforBooking);
    console.log(
      '--------------------------danh sách khách hàng người lơn---------------------------------'
    );
    console.log(inforAdults);
    console.log(
      '-----------------danh sách khách hàng trẻ em------------------------------------------'
    );
    console.log(inforChildren);
    console.log(
      '----------------danh sách khách hàng em bé-------------------------------------------'
    );
    console.log(inforYoung);

    // var customerOrder = req.body.customer;
    // var getSeatDetail = req.body.seatDetail;
    // var getOrder = req.body.order;

    // // tìm khách hang đã tồn tại hay chưa
    // const customerExist = await customer.findOne({
    //   phone: customerOrder.phone,
    //   email: customerOrder.email,
    // });

    // // nếu khách hàng tông tại thực hiện lưu thông tin đăng ký tour
    // if (customerExist !== null) {
    //   getSeatDetail.customerId = customerExist._id;

    //   const newSeatDetail = new seatDetail({
    //     tourId: getSeatDetail.tourId,
    //     listCutomerTour: getSeatDetail.listCutomerTour,
    //     customerId: getSeatDetail.customerId,
    //     amountRoom: getSeatDetail.amountRoom,
    //     totalPrice: getSeatDetail.totalPrice,
    //   });

    //   newSeatDetail.save(function (err) {
    //     if (err)
    //       res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
    //   });
    //   const newOrder = new order({
    //     orderCode: getOrder.orderCode,
    //     orderDate: getOrder.orderDate,
    //     listOrderDetail: null,
    //     seatDetail: newSeatDetail._id,
    //     total: getOrder.total,
    //   });
    //   newOrder.save(function (err) {
    //     if (err)
    //       res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
    //   });
    // }
    // // nếu khách hàng không tồn tại thực hiện đăng ký thông tin khách hàng mới
    // else {
    //   const newCustomer = new customer(customerOrder);
    //   newCustomer.save(function (err) {
    //     if (err)
    //       res.status(500).send({ message: CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL });
    //   });
    //   getSeatDetail.customerId = newCustomer._id;
    //   const newSeatDetail = new seatDetail({
    //     tourId: getSeatDetail.tourId,
    //     listCutomerTour: getSeatDetail.listCutomerTour,
    //     customerId: getSeatDetail.customerId,
    //     amountRoom: getSeatDetail.amountRoom,
    //     totalPrice: getSeatDetail.totalPrice,
    //   });
    //   newSeatDetail.save(function (err) {
    //     if (err)
    //       res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
    //   });
    //   const newOrder = new order({
    //     orderCode: getOrder.orderCode,
    //     orderDate: getOrder.orderDate,
    //     listOrderDetail: null,
    //     seatDetail: newSeatDetail._id,
    //     total: getOrder.total,
    //   });
    //   newOrder.save(function (err) {
    //     if (err)
    //       res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
    //   });
    // }
    // res.status(200).send(newOrder);
  } catch (error) {
    if (err) res.status(500).send({ message: ORDERCONSTANT.SYSTEM_ERROR });
  }
};
module.exports = {
  getAllOrder,
  createOrderForCustomer,
};
