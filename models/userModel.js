//require mongoose package
const mongoose = require('mongoose');
//require validator package
const validator = require('validator');
//require bcrypt package
const bcrypt = require('bcryptjs');

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
        validate: {
            // this only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
});

userSchema.pre('save', async function (next) {
    // if password is not modified, then return next
    if (!this.isModified('password')) return next();
    // if password is modified, then hash the password
    this.password = await bcrypt.hashSync(this.password, 12);
    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// create a model of userSchema
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;