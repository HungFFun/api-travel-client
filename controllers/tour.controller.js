const tour = require('../models/tour.model');
const tourService = require('../services/tour.service');
const TIME = require('../utils/time');
const TOURCONSTANT = require('../constants/tour.constant');
const imageDBS3 = require('../config/imageDBS3');
var moment = require('moment');

const getAllTour = async (req, res) => {
  try {
    const allTour = await tour
      .find({})
      .populate(['hotel', 'place', 'employee']);
    if (allTour.length != 0) {
      res.status(200).send(allTour);
    } else {
      res.status(200).send({message:TOURCONSTANT.NOT_FOUND_TOUR});
    }
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};
const getTourById = async (req, res) => {
  try {
    const id = req.body.id;
    const tourById = await tour.findById({ _id: id }).populate('employee');
    if (tourById.length != 0) {
      res.status(200).send(tourById);
    } else {
      res.status(200).send({message:TOURCONSTANT.NOT_FOUND_TOUR});
    }
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

const getTourByKeyword = async (req, res) => {
  try {
    const { startDate, endDate, adult, startPlace, numberTicket } = req.body;
    let query = {};
    let priceDetail = null;
    let ticket = 0;
    if(startDate !== undefined){
      var sDate = new Date(moment(startDate))
      sDate.setDate(sDate.getDate()+1)
      query.startDate = sDate;
    }
    if(endDate !== undefined){
      var eDate = new Date(moment(endDate))
      eDate.setDate(eDate.getDate()+1)
      query.endDate = eDate;
    }
    // startDate ? (query.startDate = new Date(moment(startDate))) : '';
    // endDate ? (query.endDate = new Date(moment(endDate))): '';
    adult ? (priceDetail = adult) : '';
    startPlace ? (query.startPlace = startPlace) : '';
    numberTicket ? (ticket = numberTicket) : '';
    console.log(query);
    let listTour;
    if (priceDetail == null) {
      listTour = await tour
        .find(query)
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    //  Từ 0 đến 4 triệu
    else if (priceDetail == 1) {
      listTour = await tour
        .find({
          $and: [query, { 'priceDetail.adult': { $gte: 0, $lte: 2000000 } }],
        })
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    //  Từ 2 đến 4 triệu
    else if (priceDetail == 2) {
      listTour = await tour
        .find({
          $and: [
            query,
            { 'priceDetail.adult': { $gte: 2000000, $lte: 4000000 } },
          ],
        })
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    //   // Từ 4 đến 6 triệu
    else if (priceDetail == 3) {
      listTour = await tour
        .find({
          $and: [
            query,
            { 'priceDetail.adult': { $gte: 4000000, $lte: 6000000 } },
          ],
        })
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    //   // Từ 6 đên 10 triệu
    else if (priceDetail == 4) {
      listTour = await tour
        .find({
          $and: [
            query,
            { 'priceDetail.adult': { $gte: 6000000, $lte: 10000000 } },
          ],
        })
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    //   // Trên 10 triệu
    else if (priceDetail == 5) {
      listTour = await tour
        .find({ $and: [query, { 'priceDetail.adult': { $gte: 10000000 } }] })
        .where('numberTicket')
        .gte(ticket)
        .populate(['hotel', 'place', 'employee']);
    }
    if (listTour !== null) {
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
      .sort({ startDate: 1 });
    res.status(200).send(listTourByTourName);
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.SYSTEM_ERROR });
  }
};

const findTourByTourNameAndStartDate = async (req, res) => {
  try {
    const tourName = req.body.tourName;
    const startDate = new Date(moment(req.body.startDate));
  
    startDate.setDate(startDate.getDate()+1);
    const tourByName = await tour.findOne({
      $and: [{ tourName: tourName }, { startDate: startDate }],
    });
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
};
