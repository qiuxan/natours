// import tourController from '../controllers/tourController.js';

const express = require('express');
const { getAllTours, creatTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require("../controllers/tourController");

//import authController
const authController = require('../controllers/authController');

const router = express.Router();

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
    .delete(deleteTour);

module.exports = router;