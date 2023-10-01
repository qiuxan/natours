const multer = require('multer');
const sharp = require('sharp');
//require user model
const User = require("../models/userModel");
// import catchAsync
const catchAsync = require("../utils/catchAsync");
//require appError
const AppError = require('../utils/appError');

// import handlerFactory
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // cb(null, 'public/img/users');
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // user-userid-timestamp.jpeg
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })

// multer storage in memory

const multerStorage = multer.memoryStorage();

// multer filter
const multerFilter = (req, file, cb) => {
    // check if the file is an image
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.resizeUserPhoto = (req, res, next) => {
    // if there is no file, then return next()
    if (!req.file) return next();

    // set filename property on req.body
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        // if the allowedFields array contains the element, then add it to the newObj
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.uploadPhoto = upload.single('photo');


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


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}


exports.updateMe = catchAsync(async (req, res, next) => {
    // if req.body contains password or passwordConfirm, then return error
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
    }

    // filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // if there is a file, then add photo property to filteredBody
    if (req.file) filteredBody.photo = req.file.filename;

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