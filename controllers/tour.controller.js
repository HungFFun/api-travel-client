const tour = require('../models/tour.model');
const TOURCONSTANT = require('../constants/tour.constant');
var moment = require('moment');

const getAllTour = async (req, res) => {
  try {
    const allTour = await tour
      .find({ statusTour: true })
      .populate(['hotel', 'place', 'employee']);
    if (allTour.length != 0) {
      res.status(200).send(allTour);
    } else {
      res.status(200).send(TOURCONSTANT.NOT_FOUND_TOUR);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};
const getTourById = async (req, res) => {
  try {
    const id = req.params.id;
    const tourById = await tour
      .findOne({ $and: [{ _id: id }, { statusTour: true }] })
      .populate(['employee', 'place']);
    if (tourById != null) {
      res.status(200).send(tourById);
    } else {
      res.status(200).send(TOURCONSTANT.NOT_FOUND_TOUR);
    }
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

const getTourByKeyword = async (req, res) => {
  try {
    const { startDate, endDate, adult, startPlace, numberTicket, place, transportation } = req.body;

    let query = {};
    let priceDetail = null;
    let ticket = 0;
    if (startDate !== null) {
      var sDate = new Date(moment(startDate));
      sDate.setDate(sDate.getDate() + 1);
      query.startDate = sDate;
    }
    if (endDate !== null) {
      var eDate = new Date(moment(endDate));
      eDate.setDate(eDate.getDate() + 1);
      query.endDate = eDate;
    }
    adult ? (priceDetail = adult) : '';
    startPlace ? (query.startPlace = startPlace) : '';
    numberTicket ? (ticket = numberTicket) : '';

    query.statusTour = true;

    // console.log(query);
    // console.log(priceDetail);
    let listTour;
    if (priceDetail == null) {
      if (transportation != null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }
    }
    //  T??? 0 ?????n 4 tri???u
    else if (priceDetail == 1) {
      if (transportation !== null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            // .find({
            //   $and: [query, { 'priceDetail.adult': { $gte: 0, $lte: 2000000 } }],
            // })
            .where('priceDetail.adult')
            .gte(0)
            .lte(2000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(0)
            .lte(2000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(0)
            .lte(2000000)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(0)
            .lte(2000000)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }
    }
    //  T??? 2 ?????n 4 tri???u
    else if (priceDetail == 2) {
      if (transportation !== null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(2000000)
            .lte(4000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(2000000)
            .lte(4000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(2000000)
            .lte(4000000)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(2000000)
            .lte(4000000)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }
    }
    //  T??? 4 ?????n 6 tri???u
    else if (priceDetail == 3) {
      if (transportation !== null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(4000000)
            .lte(6000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(4000000)
            .lte(6000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(4000000)
            .lte(6000000)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(4000000)
            .lte(6000000)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }
    }
    // T??? 6 ????n 10 tri???u
    else if (priceDetail == 4) {
      if (transportation !== null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(6000000)
            .lte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(6000000)
            .lte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(6000000)
            .lte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(6000000)
            .lte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }

    }
    // Tr??n 10 tri???u
    else if (priceDetail == 5) {
      if (transportation !== null) {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('transportation')
            .in(transportation)
            .populate(['hotel', 'place', 'employee']);
        }
      }
      else {
        if (place !== null) {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .where('place')
            .in(place)
            .populate(['hotel', 'place', 'employee']);
        }
        else {
          listTour = await tour
            .find(query)
            .where('priceDetail.adult')
            .gte(10000000)
            .where('numberTicket')
            .gte(ticket)
            .populate(['hotel', 'place', 'employee']);
        }
      }
    }
    if (listTour !== null) {
      // console.log(listTour.length);
      return res.status(200).send(listTour);
    }
    return res.status(200).send(listTour);
  } catch (error) {
    res.status(500).send(TOURCONSTANT.NOT_FOUND_TOUR);
  }
};

const findTourByTourName = async (req, res) => {
  try {
    const tourName = req.body.tourName;
    const listTourByTourName = await tour
      .find({ tourName: tourName })
      .select('startDate')
      .sort({ startDate: 1 })
      .populate(['hotel', 'place', 'employee']);
    res.status(200).send(listTourByTourName);
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

const findTourByTourNameAndStartDate = async (req, res) => {
  try {
    const tourName = req.body.tourName;
    const startDate = new Date(req.body.startDate);
    startDate.setUTCHours(0, 0, 0, 0);
    var endDate = new Date(req.body.startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setUTCHours(0, 0, 0, 0);
    const tourByName = await tour
      .findOne({ tourName: tourName })
      .where('startDate')
      .gte(startDate)
      .lt(endDate)
      .populate(['hotel', 'place', 'employee']);
    res.status(200).send(tourByName);
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

const findTourByPlace = async (req, res) => {
  try {
    const tourByName = await tour
      .find({})
      .where('place')
      .in(req.body.place)
      .populate(['hotel', 'place', 'employee']);
    res.status(200).send(tourByName);
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

module.exports = {
  getAllTour,
  getTourById,
  getTourByKeyword,
  findTourByTourName,
  findTourByTourNameAndStartDate,
  findTourByPlace
};
