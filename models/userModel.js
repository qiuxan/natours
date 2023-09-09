//require mongoose package
const mongoose = require('mongoose');
//require validator package
const validator = require('validator');

// create a schema of name email photo password passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        // validate email with validator package
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        trim: true,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        trim: true,
    },
});

// create a model of userSchema
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;