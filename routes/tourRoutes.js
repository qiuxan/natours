// import tourController from '../controllers/tourController.js';

const express = require('express');
const { getAllTours, creatTour, getTour, updateTour, deleteTour, checkBody } = require("../controllers/tourController");

const router = express.Router();

// router.param('id', checkId);

router.route('/')
    .get(getAllTours)
    .post(checkBody, creatTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;