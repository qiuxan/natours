//require express   
const express = require('express');
//import viewController
const viewController = require('../controllers/viewController');

//reqire authController
const authController = require('../controllers/authController');

//create a router
const router = express.Router();

router.get('/me', authController.protect, viewController.getAccount);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);

router.use(authController.isLoggedIn);


router.get('/', viewController.getOverview);

//tour route
router.get('/tour', viewController.getTour);


router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);



//export the router
module.exports = router;