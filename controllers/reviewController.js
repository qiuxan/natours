//require review model
const Review = require("../models/reviewModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: "success",
        result: reviews.length,
        data: {
            reviews
        }
    })

});

exports.createReview = catchAsync(async (req, res, next) => {
    //allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    //create a review document with the data from the request body

    const newReview = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tour,
        user: req.user._id
    });


    res.status(201).json({
        status: "success",
        data: {
            newReview
        }
    })
});

exports.getReview = catchAsync(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            review
        }
    })
});