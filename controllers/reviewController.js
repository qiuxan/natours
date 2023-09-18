//require review model
const Review = require("../models/reviewModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
// import handlerFactory
const factory = require("./handlerFactory");

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

exports.setTourUserIds = (req, res, next) => {
    console.log("hh");
    //allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    //allow nested routes
    if (!req.body.user) req.body.user = req.user._id;
    next();
}




exports.getReview = catchAsync(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            review
        }
    })
});

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);