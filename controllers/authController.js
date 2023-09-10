//require jwt package
const jwt = require('jsonwebtoken');
// import user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");

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
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // send the response
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
})