// import user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
    // create a new user
    const newUser = await User.create(req.body);
    // send the response
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
})