//require user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
//require appError
const AppError = require('../utils/appError');

// import handlerFactory
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        // if the allowedFields array contains the element, then add it to the newObj
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}


exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

exports.deleteMe = catchAsync(async (req, res, next) => {
    // set active to false
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    })
})


exports.updateMe = catchAsync(async (req, res, next) => {
    // if req.body contains password or passwordConfirm, then return error
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
    }

    // filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // console.log("🚀 ~ file: userController.js:33 ~ exports.updateMe=catchAsync ~ filteredBody:", filteredBody)
    // update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id,
        //req.body, should only change name and email
        filteredBody,
        { new: true, runValidators: true });


    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })


});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);