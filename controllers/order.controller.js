var order = require('../models/order.model');
var customerModel = require('../models/customer.model');
var orderDetailModel = require('../models/orderDetail.model')
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

    // Tạo danh sách sản phẩm cần mua
    var listOrderDetail = [];
    for (let index = 0; index < productCart.length; index++) {
      var newOrderDetail = new orderDetailModel({
        quantily: productCart[index].quantily,
        price: productCart[index].price,
        productId: productCart[index]._id,
        totalPrice: productCart[index].quantily * productCart[index].price
      })
      console.log(newOrderDetail);
      listOrderDetail.push(newOrderDetail._id)
      newOrderDetail.save(function (error) {
        if (error)
          res.status(500).send({ message: "Tạo chi tiết các sản phẩm thất bại" });
      });
    }

    // Tạo danh sách người đi
    var listCustomerTour = [];
    var priceCustomerTour = 0;
    if (inforAdults !== undefined) {
      for (let index = 0; index < inforAdults.length; index++) {
        var customerTour = {
          nameCustomer: inforAdults[index].name,
          birthDay: inforAdults[index].birthday,
          gender: inforAdults[index].gender,
          typeOfTicket: inforAdults[index].typeOfTicket,
        }
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour = priceCustomerTour + inforAdults.length * tour.priceDetail.adult;
    }
    if (inforChildren !== undefined) {
      for (let index = 0; index < inforChildren.length; index++) {
        var customerTour = {
          nameCustomer: inforChildren[index].name,
          birthDay: inforChildren[index].birthday,
          gender: inforChildren[index].gender,
          typeOfTicket: inforChildren[index].typeOfTicket,
        }
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour = priceCustomerTour + inforChildren.length * tour.priceDetail.underTheAgeOfTwelve;
    }
    if (inforYoung !== undefined) {
      for (let index = 0; index < inforYoung.length; index++) {
        var customerTour = {
          nameCustomer: inforYoung[index].name,
          birthDay: inforYoung[index].birthday,
          gender: inforYoung[index].gender,
          typeOfTicket: inforYoung[index].typeOfTicket,
        }
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour = priceCustomerTour + inforYoung.length * tour.priceDetail.underTheAgeOfFive;

    }
    // tìm khách hang đã tồn tại hay chưa
    const customerExist = await customerModel.findOne({ $or: [{ phone: customer.phone }, { email: customer.email }] });

    // nếu khách hàng tông tại thực hiện lưu thông tin đăng ký tour
    if (customerExist !== null) {
      const newSeatDetail = new seatDetail({
        tourId: tour._id,
        listCutomerTour: listCustomerTour,
        customerId: customerExist._id,
        // amountRoom: getSeatDetail.amountRoom,
        totalPrice: priceCustomerTour,
      });
      console.log("seat"  + newSeatDetail);
      newSeatDetail.save(function (err) {
        if (err)
          res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
      });
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        listOrderDetail: listOrderDetail,
        seatDetail: newSeatDetail._id,
        total: inforBooking.totalMoney,
      });
      console.log(newOrder);
      newOrder.save(function (err) {
        if (err) {
          res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
        }
        else {
          res.status(200).send(newOrder);
        }
      });
    }
    // nếu khách hàng không tồn tại thực hiện đăng ký thông tin khách hàng mới
    else {
      const newCustomer = new customerModel(customer);
      console.log(newCustomer);
      newCustomer.save(function (err) {
        if (err)
          res.status(500).send({ message: CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL });
      });
      const newSeatDetail = new seatDetail({
        tourId: tour._id,
        listCutomerTour: listCustomerTour,
        customerId: newCustomer._id,
        // amountRoom: getSeatDetail.amountRoom,
        totalPrice: priceCustomerTour,
      });
      console.log(newSeatDetail);
      newSeatDetail.save(function (err) {
        if (err)
          res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
      });
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        listOrderDetail: listOrderDetail,
        seatDetail: newSeatDetail._id,
        total: inforBooking.totalMoney,
      });
      console.log(newOrder);
      newOrder.save(function (err) {
        if (err) {
          res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
        }
        else {
          res.status(200).send(newOrder);
        }
      });
    }

  } catch (error) {
    if (error)
      res.status(500).send({ message: ORDERCONSTANT.SYSTEM_ERROR });
  }
};
module.exports = {
  getAllOrder,
  createOrderForCustomer,
};
