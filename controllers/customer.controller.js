const CUSTOMERCONSTANT = require('../constants/customer.constant');
const customer = require('../models/customer.model');
const order = require('../models/order.model');
const ORDERCONSTANT = require('../constants/order.constant');
const TOURCONSTANT = require('../constants/tour.constant');
const seatDetail = require('../models/seatDetail.model');
const productModel = require('../models/product.model');
const tour = require('../models/tour.model');
const orderDetail = require('../models/orderDetail.model');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const jwt_key = `${process.env.jwt_key}`;
require('dotenv').config();

const getAllCustomer = async (req, res) => {
  try {
    const allCustomer = await customer.find({});
    if (allCustomer.length != 0) {
      res.status(200).send(allCustomer);
    } else {
      res.status(200).send({ message: CUSTOMERCONSTANT.NOT_FOUND_CUSTOMER });
    }
  } catch (error) {
    res.status(500).send({ message: CUSTOMERCONSTANT.SYSTEM_ERROR });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const id = req.body.id;
    const customerById = await customer.findById({ _id: id });
    if (customerById.length != 0) {
      res.status(200).send(customerById);
    } else {
      res.status(200).send({ message: CUSTOMERCONSTANT.NOT_FOUND_CUSTOMER });
    }
  } catch (error) {
    res.status(500).send({ message: CUSTOMERCONSTANT.SYSTEM_ERROR });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const {
      id,
      fullName,
      gender,
      dateOfbirth,
      phone,
      email,
      identityCard,
      address,
    } = req.body;
    let query = {};
    fullName ? (query.fullName = fullName) : '';
    gender ? (query.gender = gender) : '';
    dateOfbirth ? (query.dateOfbirth = dateOfbirth) : '';
    if (phone !== undefined) {
      const customerPhone = await customer.findOne({ phone: phone });
      if (customerPhone === null) {
        query.phone = phone;
      }
    }
    if (email !== undefined) {
      const customerEmail = await customer.findOne({ email: email });
      if (customerEmail === null) {
        email ? (query.email = email) : '';
      }
    }
    identityCard ? (query.identityCard = identityCard) : '';
    address ? (query.address = address) : '';
    customer.findByIdAndUpdate({ _id: id }, { $set: query }).then((docs) => {
      res.status(200).send(docs);
    });
  } catch (error) {
    res.status(500).send({ message: CUSTOMERCONSTANT.SYSTEM_ERROR });
  }
};

const getNumberOrder = async (req, res) => {
  try {
    const customerId = req.body.id;
    const getOrder = await order
      .find({})
      // .select({ orderDate: 1 })
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
    var orderCancelled = [];
    var orderWaiting = [];
    var orderChecked = [];
    if (getOrder.length !== 0) {
      for (let i = 0; i < getOrder.length; i++) {
        const element = getOrder[i].seatDetail;
        if ((element.customer._id == customerId)) {
          if ((getOrder[i].statusOrder == 'cancelled')) {
            orderCancelled.push(getOrder[i]);
          } else if ((getOrder[i].statusOrder == 'checked')) {
            orderChecked.push(getOrder[i]);
          } else {
            orderWaiting.push(getOrder[i]);
          }
        }
      }
      res.status(200).send({ orderCancelled: orderCancelled, orderChecked: orderChecked, orderWaiting: orderWaiting });
    } else {
      res.status(200).send({ message: CUSTOMERCONSTANT.CUSTOMER_NOT_ORDER });
    }
  } catch (error) {
    res.status(500).send({ message: CUSTOMERCONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  getNumberOrder,
};
