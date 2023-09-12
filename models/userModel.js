//import crypto package
const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        trim: true,
        // hide password in output
        select: false,
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compareSync(candidatePassword, userPassword);
};

//create a method to check if user changed password after token was issued

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // if user changed password after token was issued, then return true
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    // if user did not change password after token was issued, then return false
    return false;
}

// create a method to create a password reset token

userSchema.methods.createPasswordResetToken = function () {
    // create a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // hash the password reset token
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log("🚀 ~ file: userModel.js:89 ~ this.passwordResetToken:", this.passwordResetToken)
    console.log("🚀 ~ file: userModel.js:89 ~ resetToken:", resetToken)
    // set the password reset token expiration time to 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // return the password reset token
    return resetToken;
}

// create a model of userSchema
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;