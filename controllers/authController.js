//require jwt package
const jwt = require('jsonwebtoken');
// import user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

//sign Token
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
})


exports.signup = catchAsync(async (req, res, next) => {
    // create a new user
    // const newUser = await User.create(req.body);
    // create a new user with only name, email, password and passwordConfirm
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

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