const customer = require('../models/customer.model');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const jwt_key = `${process.env.jwt_key}`;
require('dotenv').config();

const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Xem khách hàng tồn tại qua email
    const customerExist = await customer.findOne({ email: email });
    // giải mã lại password của user
    const isPasswordMatch = await bcrypt.compare(
      password,
      customerExist.password
    );

    if (customerExist !== null) {
      if (isPasswordMatch) {
        if (customerExist.activationStatus === true) {
          res.status(200).send(customerExist);
        } else {
          res.status(200).send({ message: 'Tài khoản đã bị đóng' });
        }
      } else {
        res.status(200).send({ message: 'Sai mật khẩu' });
      }
    } else {
      res.status(200).send({ message: 'Không tìm thấy tài khoản' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const registerAccount = async (req, res) => {
  try {
    const { fullName, birthday, phone, email, password } = req.body;
    // Mã hóa password
    const passwordBcrypt = bcrypt.hashSync(password, 8);

    // Xem khách hàng tồn tại hay chưa qua di động hoặc email
    const customerExist = await customer.findOne({
      $or: [{ phone: phone }, { email: email }],
    });

    if (customerExist === null) {
      const newCustomer = new customer({
        fullName: fullName,
        birthday: birthday,
        phone: phone,
        email: email,
        password: passwordBcrypt,
      });
      newCustomer.token = jwt.sign({ _id: newCustomer._id }, jwt_key);
      console.log(newCustomer);
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

const loginFaceOrGoogle = async (req, res) => {
  try {
    const { displayName, email } = req.body;
    // Xem khách hàng tồn tại hay chưa qua di động hoặc email
    const customerExist = await customer.findOne({ email: email });
    if (customerExist !== null) {
      res.status(200).send(customerExist);
    } else {
      const newCustomer = new customer({
        fullName: displayName,
        email: email,
      });
      newCustomer.token = jwt.sign({ _id: newCustomer._id }, jwt_key);
      newCustomer
        .save()
        .then((value) => {
          res.status(200).send(newCustomer);
        })
        .catch((error) => {
          res.status(500).send({ message: 'Thêm khách hàng thất bại' });
        });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const updateStatusAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const activationStatus = req.body.activationStatus;
    customer.findByIdAndUpdate(
      { _id: id },
      { $set: { activationStatus: activationStatus } },

      function (err) {
        if (err) {
          res.status(500).send({ message: 'Update trạng thái thất bại' });
        } else {
          if (activationStatus === true) {
            res.status(200).send({ message: 'Tài khoản được mở lại' });
          } else {
            res.status(200).send({ message: 'Khóa tài khoản thành công' });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const getUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const userById = await customer.findById({ _id: id });
    if (userById.length != 0) {
      res.status(200).send(userById);
    } else {
      res.status(500).send({ message: 'User không tồn tại' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const userByToken = await customer.findOne({ token: req.body.token });

    if (userByToken !== null) {
      res.status(200).send(userByToken);
    } else {
      res.status(500).send({ message: 'User không tồn tại' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

const updatePasword = async (req, res) => {
  try {
    const id = req.body._id;
    const password = req.body.passnew;
    customer
      .findByIdAndUpdate({ _id: id }, { $set: { password: password } })
      .then((value) => {
        res.status(200).send(value);
      })
      .catch((error) => {
        res.status(500).send({ message: 'Đổi password thất bại' });
      });
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

module.exports = {
  loginAccount,
  registerAccount,
  updateStatusAccount,
  updatePasword,
  getUserId,
  getUserByToken,
  loginFaceOrGoogle,
};
