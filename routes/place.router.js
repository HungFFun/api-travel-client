const express = require('express');
const router = express.Router();
const placeController = require('../controllers/place.controller');

// api place
router.get('/api/places', placeController.getAllPlace);

module.exports = router;
