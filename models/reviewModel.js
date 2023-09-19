//require mongoose
const mongoose = require('mongoose');
//require tour model
const Tour = require('./tourModel');

//create schema

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    tour: {// parent referencing - each review will have a tour
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {// parent referencing - each review will have a user
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }

}, {
    toJSON: { virtuals: true },// when data is outputted as JSON, virtuals will be included
    toObject: { virtuals: true },// when data is outputted as Object, virtuals will be included
});


reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // })
    //     .populate({
    //         path: 'user',
    //         select: 'name photo'
    //     });


    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

//static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    console.log("🚀 ~ file: reviewModel.js:60 ~ tourId:", tourId)
    const stats = await this.aggregate([// this points to the current model
        {
            $match: { tour: tourId },

        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    // save the average rating to the tour
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }

    // console.log(stats);
};

reviewSchema.post('save', function () {
    // this points to the current review
    this.constructor.calcAverageRatings(this.tour);
});


//uddate the average rating to the tour when a review is deleted or updated

//findByIdAndUpdate 
//findByIdAndDelete 
//there is no document middleware for these methods
//so it is required to use some other method

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    // console.log(this.r);

    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
});



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;