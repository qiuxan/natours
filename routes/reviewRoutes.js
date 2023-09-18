//require express
const express = require('express');
//import reviewController
const reviewController = require('../controllers/reviewController');
//import authController
const { protect, restrictTo } = require('../controllers/authController');
//create router
const router = express.Router({ mergeParams: true });

//protect all routes after this middleware
router.use(protect);

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router.route('/:id')
    .get(reviewController.getReview)
    .patch(restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(restrictTo('user', 'admin'), reviewController.deleteReview);

//export router
module.exports = router;