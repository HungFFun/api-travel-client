const product = require('../models/product.model');
const PRODUCTCONSTANT = require('../constants/product.constant');

const getAllProduct = async (req, res) => {
  try {
    const allProduct = await product.find({});
    if (allProduct.length !== 0) {
      res.status(200).send(allProduct);
    } else {
      res.status(200).send({ message: PRODUCTCONSTANT.NOT_FOUND_PRODUCT });
    }
  } catch (error) {
    res.status(500).send({ message: PRODUCTCONSTANT.SYSTEM_ERROR });
  }
};
const getProductById = async (req, res) => {
  try {
    const id = req.body.id;
    const productById = await product.findById({ _id: id });
    if (productById.length != 0) {
      res.status(200).send(productById);
    } else {
      res.status(200).send({ message: PRODUCTCONSTANT.NOT_FOUND_PRODUCT });
    }
  } catch (error) {
    res.status(500).send({ message: PRODUCTCONSTANT.SYSTEM_ERROR });
  }
};

// get product qua type
const getProductByType = async (req, res) => {
  try {
    const typesOftourism = req.body.typesOftourism;
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
    res.status(500).send({ message: PRODUCTCONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  getProductByType
};
