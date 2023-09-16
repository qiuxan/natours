//require mongoose
const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;