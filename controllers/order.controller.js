var order = require('../models/order.model');
var customer = require('../models/customer.model');
var seatDetail = require('../models/seatDetail.model');
const RESPONSE = require('../utils/response');
var ORDERCONSTANT = require('../constants/order.constant');
var CUSTOMERCONSTANT = require('../constants/customer.constant');
var moment = require('moment');

const getAllOrder = async (req, res) => {
  try {
    const listOrder = await order
      .find({})
      .populate(['orderDetail', 'seatDetail']);
    if (listOrder !== null) {
      res
        .status(200)
        .send(new RESPONSE(ORDERCONSTANT.FIND_ORDER_SUCCESS, listOrder));
    }
    res.status(200).send(new RESPONSE(ORDERCONSTANT.NOT_FIND_ORDER, []));
  } catch (error) {
    res.status(500).send(new RESPONSE(ORDERCONSTANT.FIND_ORDER_FAIL));
  }
};

const getAllOrderByCustomer = async (req, res) => {};

const createOrderForCustomer = async (req, res) => {
  try {
    console.log(req.body);
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
        if (err) res.status(500).send(new RESPONSE('Loi tao seat'));
      });
      var newOrder = new order({
        orderCode: getOrder.orderCode,
        orderDate: moment(getOrder.orderDate),
        listOrderDetail: null,
        seatDetail: newSeatDetail._id,
        total: getOrder.total,
      });
      newOrder.save(function (err) {
        if (err) res.status(500).send(new RESPONSE('loi tao order'));
      });
    } else {
      var newCustomer = new customer(customerOrder);
      newCustomer.save(function (err) {
        if (err)
          res
            .status(500)
            .send(new RESPONSE(CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL));
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
        if (err) res.status(500).send(new RESPONSE('Loi tao seat'));
      });
      var newOrder = new order({
        orderCode: getOrder.orderCode,
        orderDate: moment(getOrder.orderDate),
        listOrderDetail: null,
        seatDetail: newSeatDetail._id,
        total: getOrder.total,
      });
      newOrder.save(function (err) {
        if (err) res.status(500).send(new RESPONSE('loi tao order'));
      });
    }
    res.status(200).send(new RESPONSE(ORDERCONSTANT.CREATE_ORDER_SUCCESS, []));
  } catch (error) {
    res.status(500).send(new RESPONSE(ORDERCONSTANT.CREATE_ORDER_FAIL));
  }
};
module.exports = {
  getAllOrder,
  createOrderForCustomer,
};
