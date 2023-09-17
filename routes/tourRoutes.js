// import tourController from '../controllers/tourController.js';

const express = require('express');
const { getAllTours, creatTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require("../controllers/tourController");

//require reviewController
// const reviewController = require('../controllers/reviewController');

//require review router
const reviewRouter = require('./reviewRoutes');
//import authController
const authController = require('../controllers/authController');

const router = express.Router();


//POST /tour/234fad4/reviews  
// router.route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restricTo('user'),
//         reviewController.createReview
//     );
//GET /tour/234fad4/reviews
//GET /tour/234fad4/reviews/9483fdd

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', checkId);

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/')
    .get(authController.protect, getAllTours)
    .post(creatTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(authController.protect,
        authController.restricTo('admin', 'lead-guide'),
        deleteTour);



module.exports = router;