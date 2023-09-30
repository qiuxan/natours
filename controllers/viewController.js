//require tourModel
const Tour = require('../models/tourModel');
//require catchAsync
const catchAsync = require('../utils/catchAsync');
//require AppError
const AppError = require('../utils/appError');
//require User
const User = require('../models/userModel');


exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template

    // 3) Render that template using tour data from 1)


    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
});

exports.getTour = catchAsync(async (req, res, next) => {

    // 1) Get the data, for the requested tour (including reviews and guides) based on the slug
    const tour = await Tour.findOne({
        slug: req.params.slug
    }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // req.params.tourSlug
    // console.log("🚀 ~ file: viewController.js:32 ~ exports.getTour=catchAsync ~ req.params.tourSlug:", req.params.tourSlug)
    // console.log("🚀 ~ file: viewController.js:31 ~ exports.getTour=catchAsync ~ tour:", tour)
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404))
    }
    res.status(200)
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour
        });
})

exports.getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
});

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
};

exports.updateUserData = catchAsync(async (req, res, next) => {

    // console.log('UPDATING USER', req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    })
});

