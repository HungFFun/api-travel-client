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
    res.status(200).send({message:ORDERCONSTANT.NOT_FIND_ORDER});
  } catch (error) {
    res.status(500).send({message:ORDERCONSTANT.SYSTEM_ERROR});
  }
};

const createOrderForCustomer = async (req, res) => {
  try {
    var customerOrder = req.body.customer;
    var getSeatDetail = req.body.seatDetail;
    var getOrder = req.body.order;
    const customerExist = await customer.findOne({
      phone: customerOrder.phone,
      email: customerOrder.email,
    });
    if (customerExist !== null) {
      getSeatDetail.customerId = customerExist._id;
      var newSeatDetail = new seatDetail({
        tourId: getSeatDetail.tourId,
        listCutomerTour: getSeatDetail.listCutomerTour,
        customerId: getSeatDetail.customerId,
        amountRoom: getSeatDetail.amountRoom,
        totalPrice: getSeatDetail.totalPrice,
      });
      newSeatDetail.save(function (err) {
        if (err) res.status(500).send({message:ORDERCONSTANT.CREATE_SEAT_FAIL});
      });
      var newOrder = new order({
        orderCode: getOrder.orderCode,
        orderDate: getOrder.orderDate,
        listOrderDetail: null,
        seatDetail: newSeatDetail._id,
        total: getOrder.total,
      });
      newOrder.save(function (err) {
        if (err) res.status(500).send({message:ORDERCONSTANT.CREATE_ORDER_FAIL});
      });
    } else {
      var newCustomer = new customer(customerOrder);
      newCustomer.save(function (err) {
        if (err)
          res.status(500).send({message:CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL});
      });
      getSeatDetail.customerId = newCustomer._id;
      var newSeatDetail = new seatDetail({
        tourId: getSeatDetail.tourId,
        listCutomerTour: getSeatDetail.listCutomerTour,
        customerId: getSeatDetail.customerId,
        amountRoom: getSeatDetail.amountRoom,
        totalPrice: getSeatDetail.totalPrice,
      });
      newSeatDetail.save(function (err) {
        if (err) res.status(500).send({message:ORDERCONSTANT.CREATE_SEAT_FAIL});
      });
      var newOrder = new order({
        orderCode: getOrder.orderCode,
        orderDate: getOrder.orderDate,
        listOrderDetail: null,
        seatDetail: newSeatDetail._id,
        total: getOrder.total,
      });
      newOrder.save(function (err) {
        if (err) res.status(500).send({message:ORDERCONSTANT.CREATE_ORDER_FAIL});
      });
    }
    res.status(200).send(newOrder);
  } catch (error) {
    if (err) res.status(500).send({message:ORDERCONSTANT.SYSTEM_ERROR});
  }
};
module.exports = {
  getAllOrder,
  createOrderForCustomer,
};
