//require review model
const Review = require("../models/reviewModel");
// import catchAsync
// const catchAsync = require("../utils/catchAsync");
// import handlerFactory
const factory = require("./handlerFactory");

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
    console.log("hh");
    //allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    //allow nested routes
    if (!req.body.user) req.body.user = req.user._id;
    next();
}



exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);