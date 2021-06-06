const customer = require('../models/customer.model');
const ACCOUNTCONSTANT = require('../constants/account.constant');
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
    // kiểm trả account có tồn tại hay không
    if (customerExist !== null) {
      // kiểm trả mật khẩu
      if (isPasswordMatch) {
        // kiểm trả trạng thái tài khoản
        if (customerExist.activationStatus === true) {
          res.status(200).send(customerExist);
        } else {
          res.status(200).send({ message: ACCOUNTCONSTANT.ACCOUNT_LOCKED });
        }
      } else {
        res.status(200).send({ message: ACCOUNTCONSTANT.PASSWORD_ACCOUNT_FAIL });
      }
    } else {
      res.status(200).send({ message: ACCOUNTCONSTANT.NOT_FOUND_ACCOUNT });
    }
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
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
    // kiểm trả account có tồn tại hay không
    if (customerExist === null) {
      // tài khoản chưa tồn tại => khởi tạo tài khoản
      const newCustomer = new customer({
        fullName: fullName,
        birthday: birthday,
        phone: phone,
        email: email,
        password: passwordBcrypt,
      });
      // Tạo token cho font-end lưu vào store
      newCustomer.token = jwt.sign({ _id: newCustomer._id }, jwt_key);
      newCustomer.save()
        .then((value) => {
          res.status(200).send(value);
        })
        .catch((error) => {
          res.status(500).send({ message: ACCOUNTCONSTANT.ADD_ACCOUNT_FAIL });
        });
    } else {
      res.status(200).send({ message: ACCOUNTCONSTANT.ACCOUNT_EXISTED });
    }
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
  }
};

const updateStatusAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const activationStatus = req.body.activationStatus;
    // update trạng thái của tài khoản qua id
    customer.findByIdAndUpdate(
      { _id: id },
      { $set: { activationStatus: activationStatus } },
      function (err) {
        if (err) {
          res.status(500).send({ message: ACCOUNTCONSTANT.UPDATE_STATUS_FAIL });
        } else {
          // đóng hoặc mở dựa vào activationStatus được nhận qua request
          if (activationStatus === true) {
            res.status(200).send({ message: ACCOUNTCONSTANT.UNLOCK_ACCOUNT_SUCCESS });
          } else if (activationStatus === false) {
            res.status(200).send({ message: ACCOUNTCONSTANT.LOCK_ACCOUNT_SUCCESS });
          }else{
            res.status(500).send({ message: ACCOUNTCONSTANT.UPDATE_STATUS_FAIL });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
  }
};

//Tìm tài khoản qua UserId
const getUserId = async (req, res) => {
  try {
    const id = req.body.id;
    const userById = await customer.findById({ _id: id });
    if (userById.length != 0) {
      res.status(200).send(userById);
    } else {
      res.status(500).send({ message: ACCOUNTCONSTANT.NOT_FOUND_ACCOUNT});
    }
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
  }
};


// tìm tài khoản qua token
const getUserByToken = async (req, res) => {
  try {
    const userByToken = await customer.findOne({ token: req.body.token });
    if (userByToken !== null) {
      res.status(200).send(userByToken);
    } else {
      res.status(500).send({ message: ACCOUNTCONSTANT.NOT_FOUND_ACCOUNT });
    }
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
  }
};

const updatePasswordByToken = async (req, res) => {
  try {
    const {token,password }= req.body;
    // mã hóa password
    const passwordBcrypt = bcrypt.hashSync(password, 8);
    customer
      .findOneAndUpdate({ token: token }, { $set: { password: passwordBcrypt } })
      .then((value) => {
        res.status(200).send(value);
      })
      .catch((error) => {
        res.status(500).send({ message: ACCOUNTCONSTANT.CHANGE_PASS_FAIL});
      });
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
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
          res.status(500).send({ message: ACCOUNTCONSTANT.ADD_ACCOUNT_FAIL });
        });
    }
  } catch (error) {
    res.status(500).send({ message: ACCOUNTCONSTANT.SYSTEM_ERROR });
  }
};

const changePassword = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const passwordBcrypt = bcrypt.hashSync(password, 8);
    customer.findOneAndUpdate({ email: email }, { $set: { password: passwordBcrypt }}).then((docs) => {
      res.status(200).send(docs);
    });
  } catch (error) {
    res.status(500).send({ message: CUSTOMERCONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  loginAccount,
  registerAccount,
  updateStatusAccount,
  updatePasswordByToken,
  getUserId,
  getUserByToken,
  loginFaceOrGoogle,
  changePassword,
};
