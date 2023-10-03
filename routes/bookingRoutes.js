const express = require('express');
const bookingController = require('../controllers/bookingController.js');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.get(
    '/checkout-session/:tourId',
    protect,
    bookingController.getCheckoutSession
);

//export router
module.exports = router;