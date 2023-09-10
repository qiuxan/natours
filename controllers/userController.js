//require user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");


exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}
exports.getAllUsers = catchAsync(async (req, res, next) => {
    //get all users
    const users = await User.find();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        }
    })
})
exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}
