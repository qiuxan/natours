// import tourController from '../controllers/tourController.js';
const { getAllTours, creatTour, getTour, updateTour, deleteTour } = require('./../controllers/tourController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(getAllTours)
    .post(creatTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;