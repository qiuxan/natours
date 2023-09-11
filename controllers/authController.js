//require util package
const { promisify } = require('util');
//require jwt package
const jwt = require('jsonwebtoken');
// import user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const exp = require('constants');

//sign Token
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
})


exports.signup = catchAsync(async (req, res, next) => {
    // create a new user
    // const newUser = await User.create(req.body);
    // create a new user with only name, email, password and passwordConfirm
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    //     // passwordChangedAt: req.body.passwordChangedAt,
    //     // role: req.body.role,
    // });

    const newUser = await User.create(req.body);
    // create a token
    const token = signToken(newUser._id);

    // send the response
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    })
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

    // GRANT ACCESS TO PROTECTED ROUTE
    next();
})

exports.restricTo = (...roles) => (req, res, next) => {
    // roles ['admin', 'lead-guide']
    // console.log("🚀 ~ file: authController.js:99 ~ return ~ roles", roles)
    // console.log("🚀 ~ file: authController.js:99 ~ return ~ req.user.role", req.user.role)
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
}