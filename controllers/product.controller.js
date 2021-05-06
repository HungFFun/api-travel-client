const product = require('../models/product.model');
const PRODUCTCONSTANT = require('../constants/product.constant');
const RESPONSE = require('../utils/response');
const imageDBS3 = require('../config/imageDBS3');

const getAllProduct = async (req, res) => {
  try {
    const allProduct = await product.find({});
    if (allProduct.length !== 0) {
      res.status(200).send(allProduct);
    } else {
      res.status(500).send({ message: 'Danh sách sản phẩm trống' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const productById = await product.findById({ _id: id });
    if (productById != null) {
      res.status(200).send(productById);
    } else {
      res.status(200).send({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};
// get product qua type
const getProductByType = async (req, res) => {
  try {
    const typesOftourism = req.body.typesOftourism;
    console.log(typesOftourism);
    if (typesOftourism === 'null') {
      const allProduct = await product.find({});
      res.status(200).send(allProduct);
    } else {
      const productByTypesOftourism = await product.find({
        typesOftourism: { $in: [typesOftourism] },
      });
      res.status(200).send(productByTypesOftourism);
    }
  } catch (error) {
    res.status(500).send({ message: 'System Error' });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  getProductByType
};
