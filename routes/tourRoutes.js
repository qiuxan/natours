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

router.use('/:tourId/reviews', reviewRouter);


router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        getMonthlyPlan
    );

router.route('/')
    .get(getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        creatTour
    );

router.route('/:id')
    .get(getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        deleteTour
    );



module.exports = router;