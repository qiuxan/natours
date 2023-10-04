//require crypto package
const crypto = require('crypto');
//require util package
const { promisify } = require('util');
//require jwt package
const jwt = require('jsonwebtoken');
// import user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
// import sendEmail
const Email = require('../utils/email');


//sign Token
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
})


exports.protect = catchAsync(async (req, res, next) => {

    //1> Getting token and check if it's there
    let token;
    if (
        req.headers.authorization
        && req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        // console.log("🚀 ~ file: authController.js:67 ~ exports.protect=catchAsync ~ token:", token)
    }
    else if (req.cookies.jwt) {// check if there is a cookie named jwt
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    //2> Verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3> Check if user still exists

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) return next(new AppError('The user belonging to this token does no longer exist', 401));
    //4> Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401));
    }

    req.user = freshUser;
    res.locals.user = freshUser; // can access it from the pug

    // GRANT ACCESS TO PROTECTED ROUTE
    next();
})

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {// check if there is a cookie named jwt
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const freshUser = await User.findById(decoded.id);
            if (!freshUser) return next();
            if (freshUser.changedPasswordAfter(decoded.iat)) return next();
            res.locals.user = freshUser; // can access it from the pug
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
}


const createSendToken = (user, statusCode, req, res) => {
    // create a token
    const token = signToken(user._id);

    //send token via cookie

    res.cookie('jwt', token, { // cookie options
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // convert to miliseconds  
        httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
        secure: req.secure || req.headers('x-forwarded-proto') === 'https'
    });

    user.password = undefined; // remove password from the output

    // send the response
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        },
    });
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    // create a token
    await new Email(newUser, `${req.protocol}://${req.get('host')}/me`).sendWelcome();
    createSendToken(newUser, 201, req, res);
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1> check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    //2> check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    // console.log("🚀 ~ file: authController.js:44 ~ exports.login=catchAsync ~ user:", user)

    //if there is no user or password is incorrect, return error
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3> if everything ok, send token to client
    createSendToken(user, 200, req, res);

})


exports.restrictTo = (...roles) => (req, res, next) => {
    // roles ['admin', 'lead-guide']
    // console.log("🚀 ~ file: authController.js:99 ~ return ~ roles", roles)
    // console.log("🚀 ~ file: authController.js:99 ~ return ~ req.user.role", req.user)
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1> Get user based on POSTed email

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with email address', 404));
    }

    //2> Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
    //3> Send it to user's email

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }

});
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1> Get user based on the token
    const hashedToken
        = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //2> If token has not expired, and there is user, set the new password

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // delete passwordResetToken and passwordResetExpires

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    //3> Update changedPasswordAt property for the use
    //do it in userModel.js pre save middleware
    // save the user
    await user.save();

    //4> Log the user in, send JWT

    createSendToken(user, 200, req, res);

});

// action update password
exports.updatePassword = catchAsync(async (req, res, next) => {
    // console.log("🚀 ~ file: authController.js:192 ~ exports.updatePassword=catchAsync ~ req:", req.body.passwordCurrent)
    //1> Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // console.log("🚀 ~ file: authController.js:194 ~ exports.updatePassword=catchAsync ~ user:", user)
    //2> Check if POSTed current password is correct

    //campare the entered password req.body.password with the user password in the database
    if (!await user.correctPassword(req.body.passwordCurrent, user.password)) {
        return next(new AppError('Your current password is wrong', 401));
    }
    //3> If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // do not use User.findByIdAndUpdate() because it will not work as intended
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();
    //4> Log user in, send JWT
    createSendToken(user, 200, req, res);
});

