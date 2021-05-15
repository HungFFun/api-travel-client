const order = require('../models/order.model');
const customerModel = require('../models/customer.model');
const orderDetailModel = require('../models/orderDetail.model');
const tourModel = require('../models/tour.model');
const productModel = require('../models/product.model');
const seatDetailModel = require('../models/seatDetail.model');
const ORDERCONSTANT = require('../constants/order.constant');
const CUSTOMERCONSTANT = require('../constants/customer.constant');
const moment = require('moment');
const orderModel = require('../models/order.model');

const getAllOrder = async (req, res) => {
  try {
    const { orderCode } = req.body;
    let query = {};
    orderCode ? (query.orderCode = orderCode) : '';
    const listOrder = await order
      .find(query)
      .populate({
        path: 'orderDetail',
        // populate trong models con
        populate: {
          path: 'product',
          // select những thuộc tính cần thiết
          select: { productName: 1, price: 1, image: 1 },
        },
      })
      .populate([
        {
          path: 'seatDetail',
          populate: [
            {
              path: 'customer',
              select: { fullName: 1, email: 1, phone: 1, address: 1 },
            },
            {
              path: 'tour',
              select: { tourName: 1, listImage: 1 },
            },
          ],
        },
      ]);

    if (listOrder.length != 0) {
      res.status(200).send(listOrder);
    } else {
      res.status(200).send({ message: ORDERCONSTANT.NOT_FIND_ORDER });
    }
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
    var orderDetail = [];
    for (let i = 0; i < productCart.length; i++) {
      const newOrderDetail = new orderDetailModel({
        quantity: productCart[i].quantity,
        price: productCart[i].price,
        product: productCart[i]._id,
        totalPrice: productCart[i].quantity * productCart[i].price,
      });
      orderDetail.push(newOrderDetail._id);
      newOrderDetail
        .save()
        .then((value) => {
          console.log('Tạo chi tiết các sản phẩm thành công');
        })
        .catch((error) => {
          console.log('Tạo chi tiết các sản phẩm thất bại');
          // res
          // .status(500)
          // .send({ message: 'Tạo chi tiết các sản phẩm thất bại' });
        });
      var getProductById = await productModel.findById({
        _id: newOrderDetail.product,
      });
      if (getProductById != null) {
        getProductById.quantity =
          getProductById.quantity - newOrderDetail.quantity;
        productModel
          .findByIdAndUpdate(
            { _id: getProductById._id },
            { $set: { quantity: getProductById.quantity } }
          )
          .then((value) => {
            console.log('Trừ số lượng product thành công');
          });
      }
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
      const newSeatDetail = new seatDetailModel({
        tour: tour._id,
        listCutomerTour: listCustomerTour,
        customer: customerExist._id,
        // amountRoom: getSeatDetail.amountRoom,
        totalPrice: priceCustomerTour,
      });
      newSeatDetail
        .save()
        .then((value) => {})
        .catch((error) => {
          console.log(error);
          console.log(ORDERCONSTANT.CREATE_SEAT_FAIL);
          // res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
        });
      // trừ vé tour
      tour.numberTicket = tour.numberTicket - inforBooking.totalPeople;
      if (tour.numberTicket <= 0) {
        tour.seatStatus = 'Hết chỗ';
      }
      tourModel
        .findByIdAndUpdate(
          { _id: tour._id },
          {
            $set: {
              numberTicket: tour.numberTicket,
              seatStatus: tour.seatStatus,
            },
          }
        )
        .then((value) => {
          console.log('Update số vé thành công');
        });
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        orderDetail: orderDetail,
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
        if (err) {
          console.log(CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL);
          // res.status(500).send({ message: CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL });
        } else {
          console.log(CUSTOMERCONSTANT.ADD_CUSTOMER_SUCCESS);
        }
      });
      const newSeatDetail = new seatDetailModel({
        tourId: tour._id,
        listCutomerTour: listCustomerTour,
        customer: newCustomer._id,
        // amountRoom: getSeatDetail.amountRoom,
        totalPrice: priceCustomerTour,
      });
      // console.log(newSeatDetail);
      newSeatDetail.save(function (err) {
        if (err) {
          console.log(ORDERCONSTANT.CREATE_SEAT_FAIL);
          // res.status(500).send({ message: ORDERCONSTANT.CREATE_SEAT_FAIL });
        } else {
          console.log(ORDERCONSTANT.CREATE_ORDER_SUCCESS);
        }
      });
      // trừ số  tour
      tour.numberTicket = tour.numberTicket - inforBooking.totalPeople;
      if (tour.numberTicket <= 0) {
        tour.seatStatus = 'Hết chỗ';
      }
      tourModel
        .findByIdAndUpdate(
          { _id: tour._id },
          {
            $set: {
              numberTicket: tour.numberTicket,
              seatStatus: tour.seatStatus,
            },
          }
        )
        .then((value) => {
          console.log('Update tour thành công');
        });
      const newOrder = new order({
        orderCode: inforBooking.bookId,
        orderDate: inforBooking.dateBook,
        orderDetail: orderDetail,
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

const updateOrderForCustomer = async (req, res) => {
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
    // tìm order
    var getOrderByOrderCode = await orderModel
      .findOne({ orderCode: inforBooking.bookId })
      .populate(['orderDetail', 'seatDetail']);
    var querySeat = {};
    var queryOrder = {};
    if (getOrderByOrderCode != null) {
      var seatDetail = getOrderByOrderCode.seatDetail;
      var listCustomerOld = seatDetail.listCutomerTour;
      var listOrderDetail = getOrderByOrderCode.orderDetail;
      var totalMoney = 0;
      var priceCustomerTour = 0;
      var listCustomerTour = [];
      var listproduct = [];
      //   // update lại tour đã đăng kí trước đó
      var getTourOld = await tourModel.findById({ _id: seatDetail.tour });
      getTourOld.numberTicket =
        getTourOld.numberTicket + listCustomerOld.length;
      getTourOld.seatStatus = 'Còn Chỗ';
      tourModel
        .findByIdAndUpdate(
          { _id: getTourOld._id },
          {
            $set: {
              numberTicket: getTourOld.numberTicket,
              seatStatus: getTourOld.seatStatus,
            },
          }
        )
        .then((value) => {
          console.log('Update tour cũ thành công');
        });

      // update lại người đăng kí
      if (customer !== undefined) {
        const customerExist = await customerModel.findOne({
          $or: [{ phone: customer.phone }, { email: customer.email }],
        });
        if (customerExist != null) {
          querySeat.customer = customerExist._id;
        } else {
          const newCustomer = new customerModel(customer);
          newCustomer.save(function (err) {
            if (err) {
              console.log(CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL);
              // res.status(500).send({ message: CUSTOMERCONSTANT.ADD_CUSTOMER_FAIL });
            } else {
              console.log(CUSTOMERCONSTANT.ADD_CUSTOMER_SUCCESS);
            }
          });
          querySeat.customer = newCustomer._id;
        }
      }
      // update lại giỏ hàng
      if (productCart != undefined) {
        // xóa các sản phẩm trước đó
        if (listOrderDetail.length != 0) {
          for (let i = 0; i < listOrderDetail.length; i++) {
            const element = listOrderDetail[i];
            var getProductById = await productModel.findById({
              _id: element.product,
            });
            getProductById.quantity =
              getProductById.quantity + element.quantity;
            productModel
              .findByIdAndUpdate(
                { _id: getProductById._id },
                { $set: { quantity: getProductById.quantity } }
              )
              .then((value) => {
                console.log('Cộng số lượng product thành công');
              });
            orderDetailModel
              .findByIdAndDelete({ _id: element._id })
              .then((value) => {
                console.log('Delete order Detail thành công');
              });
          }
        }
        // thêm lại sản phẩm khác
        for (let i = 0; i < productCart.length; i++) {
          const newOrderDetail = new orderDetailModel({
            quantity: productCart[i].quantity,
            price: productCart[i].price,
            product: productCart[i]._id,
            totalPrice: productCart[i].quantity * productCart[i].price,
          });
          listproduct.push(newOrderDetail._id);
          totalMoney =
            totalMoney + productCart[i].quantity * productCart[i].price;
          newOrderDetail
            .save()
            .then((value) => {
              console.log('Tạo chi tiết các sản phẩm thành công');
            })
            .catch((error) => {
              console.log('Tạo chi tiết các sản phẩm thất bại');
              // res
              // .status(500)
              // .send({ message: 'Tạo chi tiết các sản phẩm thất bại' });
            });
          var getProductById = await productModel.findById({
            _id: productCart[i]._id,
          });
          getProductById.quantity =
            getProductById.quantity - productCart[i].quantity;
          productModel
            .findByIdAndUpdate(
              { _id: getProductById._id },
              { $set: { quantity: getProductById.quantity } }
            )
            .then((value) => {
              console.log('Trừ số lượng product thành công');
            });
        }
      }
      // update lại tour
      if (tour !== undefined) {
        querySeat.tour = tour._id;
        // update lại giá tiền người đi với tour khác
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
        // trừ số  tour
        tour.numberTicket = tour.numberTicket - inforBooking.totalPeople;
        if (tour.numberTicket <= 0) {
          tour.seatStatus = 'Hết chỗ';
        }
        tourModel
          .findByIdAndUpdate(
            { _id: tour._id },
            {
              $set: {
                numberTicket: tour.numberTicket,
                seatStatus: tour.seatStatus,
              },
            }
          )
          .then((value) => {
            console.log('Update vé tour thành công');
          });
      }
      // thay đổi số lượng người đi
      else {
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
            priceCustomerTour +
            inforAdults.length * getTourOld.priceDetail.adult;
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
            inforChildren.length * getTourOld.priceDetail.underTheAgeOfTwelve;
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
            inforYoung.length * getTourOld.priceDetail.underTheAgeOfFive;
        }
        // trừ số  tour
        getTourOld.numberTicket = tour.numberTicket - inforBooking.totalPeople;
        if (getTourOld.numberTicket <= 0) {
          getTourOld.seatStatus = 'Hết chỗ';
        }
        tourModel
          .findByIdAndUpdate(
            { _id: getTourOld._id },
            {
              $set: {
                numberTicket: getTourOld.numberTicket,
                seatStatus: getTourOld.seatStatus,
              },
            }
          )
          .then((value) => {
            console.log('Update vé tour thành công');
          });
      }
      totalMoney = totalMoney + priceCustomerTour;
      querySeat.listCutomerTour = listCustomerTour;
      querySeat.totalPrice = priceCustomerTour;
      console.log(priceCustomerTour);
      seatDetailModel
        .findByIdAndUpdate({ _id: seatDetail._id }, { $set: querySeat })
        .then((value) => {
          console.log('Update seatDetail thành công');
        });
      queryOrder.orderDetail = listproduct;
      queryOrder.total = totalMoney;
      console.log(totalMoney);
      orderModel
        .findByIdAndUpdate(
          { _id: getOrderByOrderCode._id },
          { $set: queryOrder }
        )
        .then((value) => {
          res.status(200).send({ message: ORDERCONSTANT.UPDATE_ORDER_SUCCESS });
        });
    } else {
      res.status(500).send({ message: ORDERCONSTANT.NOT_FIND_ORDER });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: ORDERCONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  getAllOrder,
  createOrderForCustomer,
  updateOrderForCustomer,
};
