//require express   
const express = require('express');
//import viewController
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');

//reqire authController
const authController = require('../controllers/authController');

//create a router
const router = express.Router();

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);

router.use(authController.isLoggedIn);


router.get('/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview);

//tour route
router.get('/tour', viewController.getTour);


router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);



//export the router
module.exports = router;