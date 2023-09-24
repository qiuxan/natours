//require tourModel
const Tour = require('../models/tourModel');
//require catchAsync
const catchAsync = require('../utils/catchAsync');


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



    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
})