const order = require('../models/order.model');
const customerModel = require('../models/customer.model');
const orderDetailModel = require('../models/orderDetail.model');
const tourModel = require('../models/tour.model')
const seatDetail = require('../models/seatDetail.model');
const ORDERCONSTANT = require('../constants/order.constant');
const CUSTOMERCONSTANT = require('../constants/customer.constant');
const moment = require('moment');

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
    for (let i = 0; i < productCart.length; i++) {
      const newOrderDetail = new orderDetailModel({
        quantity: productCart[i].quantity,
        price: productCart[i].price,
        productId: productCart[i]._id,
        totalPrice: productCart[i].quantity * productCart[i].price,
      });
      listOrderDetail.push(newOrderDetail._id);
      newOrderDetail
        .save()
        .then((value) => {})
        .catch((error) => {
          res
            .status(500)
            .send({ message: 'Tạo chi tiết các sản phẩm thất bại' });
        });
    }

    // Tạo danh sách người đi
    var listCustomerTour = [];
    var priceCustomerTour = 0;
    if (inforAdults !== undefined) {
      for (let index = 0; index < inforAdults.length; index++) {
        const customerTour = {
          nameCustomer: inforAdults[index].name,
          birthDay: inforAdults[index].birthday,
          gender: inforAdults[index].gender,
          typeOfTicket: inforAdults[index].typeOfTicket,
        };
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour =
        priceCustomerTour + inforAdults.length * tour.priceDetail.adult;
    }
    if (inforChildren !== undefined) {
      for (let index = 0; index < inforChildren.length; index++) {
        const customerTour = {
          nameCustomer: inforChildren[index].name,
          birthDay: inforChildren[index].birthday,
          gender: inforChildren[index].gender,
          typeOfTicket: inforChildren[index].typeOfTicket,
        };
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour =
        priceCustomerTour +
        inforChildren.length * tour.priceDetail.underTheAgeOfTwelve;
    }
    if (inforYoung !== undefined) {
      for (let index = 0; index < inforYoung.length; index++) {
        const customerTour = {
          nameCustomer: inforYoung[index].name,
          birthDay: inforYoung[index].birthday,
          gender: inforYoung[index].gender,
          typeOfTicket: inforYoung[index].typeOfTicket,
        };
        listCustomerTour.push(customerTour);
      }
      priceCustomerTour =
        priceCustomerTour +
        inforYoung.length * tour.priceDetail.underTheAgeOfFive;
    }
    // tìm khách hang đã tồn tại hay chưa
    const customerExist = await customerModel.findOne({
      $or: [{ phone: customer.phone }, { email: customer.email }],
    });

    // nếu khách hàng tông tại thực hiện lưu thông tin đăng ký tour
    if (customerExist !== null) {
      const newSeatDetail = new seatDetail({
        tourId: tour._id,
        listCutomerTour: listCustomerTour,
        customerId: customerExist._id,
        // amountRoom: getSeatDetail.amountRoom,
        totalPrice: priceCustomerTour,
      });
      newSeatDetail
        .save()
        .then((value) => {})
        .catch((error) => {
          res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
        });
        // trừ vé tour
        tour.numberTicket = tour.numberTicket - inforBooking.totalPeople;
        if(tour.numberTicket<=0){
          tour.seatStatus = "Hết chỗ";
        }
        tourModel.findByIdAndUpdate({_id:tour._id},
          { $set: {numberTicket:tour.numberTicket,seatStatus:tour.seatStatus} }).then((value) => {
            console.log("Update số vé thành công");
          })
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        listOrderDetail: listOrderDetail,
        seatDetail: newSeatDetail._id,
        total: inforBooking.totalMoney,
      });
      newOrder
        .save()
        .then((value) => {
          res.status(200).send(newOrder);
        })
        .catch((error) => {
          res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
        });
    }
    // nếu khách hàng không tồn tại thực hiện đăng ký thông tin khách hàng mới
    else {
      const newCustomer = new customerModel(customer);
      // console.log(newCustomer);
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
      // console.log(newSeatDetail);
      newSeatDetail.save(function (err) {
        if (err)
          res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
      });
      // trừ số  tour
      tour.numberTicket = tour.numberTicket - inforBooking.totalPeople;
      if(tour.numberTicket<=0){
        tour.seatStatus = "Hết chỗ";
      }
      tourModel.findByIdAndUpdate({_id:tour._id},
        { $set: {numberTicket:tour.numberTicket,seatStatus:tour.seatStatus} }).then((value) => {
          console.log("Update tour thành công");
        })
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        listOrderDetail: listOrderDetail,
        seatDetail: newSeatDetail._id,
        total: inforBooking.totalMoney,
      });
      // console.log(newOrder);
      newOrder
        .save()
        .then((value) => {
          res.status(200).send(newOrder);
        })
        .catch((error) => {
          res.status(500).send({ message: ORDERCONSTANT.CREATE_ORDER_FAIL });
        });
    }
  } catch (error) {
    if (error) res.status(500).send({ message: ORDERCONSTANT.SYSTEM_ERROR });
  }
};
module.exports = {
  getAllOrder,
  createOrderForCustomer,
};
