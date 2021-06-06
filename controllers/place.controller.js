const place = require('../models/place.model');
const PLACECONSTANT = require('../constants/place.constant');

const getAllPlace = async (req, res) => {
  try {
    const allPlace = await place.find({});
    if (allPlace !== null) {
      res.status(200).send(allPlace);
    } else {
      res.status(200).send({ message: PLACECONSTANT.NOT_FOUND_PLACE });
    }
  } catch (error) {
    res.status(500).send({ message: PLACECONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  getAllPlace,
};
