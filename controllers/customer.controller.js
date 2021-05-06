require('dotenv').config();
const customer = require('../models/customer.model');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const jwt_key = `${process.env.jwt_key}`;

const getAllCustomer = async (req, res) => {
  try {
    const allCustomer = await customer.find({});
    if (allCustomer.length != 0) {
      res.status(200).send(allCustomer);
    } else {
      res.status(500).send({ message: 'Không tìm thấy customer' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const id = req.params.id;
    const customerById = await customer.findById({ _id: id });
    if (customerById.length != 0) {
      res.status(200).send(customerById);
    } else {
      res.status(500).send({ message: 'Không tìm thấy customer' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const addCustomer = async (req, res) => {
  try {
    const { phone, email } = req.body;
    // Mã hóa password
    const password = bcrypt.hashSync(req.body.password, 8);

    // Xem khách hàng tồn tại hay chưa qua di động hoặc email
    const customerExist = await customer.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (customerExist == null || customerExist == []) {
      const newCustomer = new customer({
        fullName: req.body.fullName,
        gender: req.body.gender,
        birthday: req.body.birthday,
        phone: phone,
        email: email,
        identityCard: req.body.identityCard,
        address: req.body.address,
        password: password,
      });
      newCustomer.token = jwt.sign({ _id: newCustomer._id }, jwt_key);
      newCustomer
        .save()
        .then((value) => {
          res.status(200).send(value);
        })
        .catch((error) => {
          res.status(500).send({ message: 'Thêm khách hàng thất bại' });
        });
    } else {
      res.status(500).send({ message: 'Khách hàng đã tồn tại' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    customer
      .findByIdAndDelete()
      .then((value) => {
        res.status(200).send(value);
      })
      .catch((error) => {
        res.status(500).send({ message: 'Xóa thông tin khách hàng thất bại' });
      });
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const id = req.body._id;
    const {
      fullName,
      gender,
      dateOfbirth,
      phone,
      email,
      identityCard,
      activationStatus,
      address,
    } = req.body;

    customer
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            fullName: fullName,
            gender: gender,
            dateOfbirth: dateOfbirth,
            phone: phone,
            email: email,
            identityCard: identityCard,
            address: address,
            activationStatus: activationStatus,
          },
        }
      )
      .then((docs) => {});
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

module.exports = {
  getAllCustomer,
  getCustomerById,
  addCustomer,
  deleteCustomer,
  updateCustomer,
};
