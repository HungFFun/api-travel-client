const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour.controller');

// api tour
router.get('/api/tours', tourController.getAllTour);
router.get('/api/tour/:id', tourController.getTourById);

router.post('/api/tours/keyword', tourController.getTourByKeyword);
router.post('/api/tours/tour-name', tourController.findTourByTourName);
router.post(
  '/api/tours/name-date',
  tourController.findTourByTourNameAndStartDate
);
router.post('/api/tours/place', tourController.findTourByPlace);

module.exports = router;
