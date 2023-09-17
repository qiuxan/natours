//require express
const express = require('express');
//import reviewController
const reviewController = require('../controllers/reviewController');
//import authController
const { protect, restricTo } = require('../controllers/authController');
//create router
const router = express.Router();


router.route('/')
    .get(reviewController.getAllReviews)
    .post(protect, restricTo('user'), reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview);
//export router
module.exports = router;