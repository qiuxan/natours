//require express   
const express = require('express');
//import viewController
const viewController = require('../controllers/viewController');

//create a router
const router = express.Router();

router.get('/', viewController.getOverview);

//tour route
router.get('/tour', viewController.getTour);

//export the router
module.exports = router;