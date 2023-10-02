const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
// const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//require handlerFactory.js
const factory = require('./handlerFactory');

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

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    console.log(req.files);
    next();
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



exports.getDistances = catchAsync(async (req, res, next) => {
    //destructure the url to get the distance, latlng and unit from the url
    const { latlng, unit } = req.params;
    //destruct the latlng to get the latitude and longitude
    const [lat, lng] = latlng.split(',');
    //convert the distance to miles or km
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    //if user didn't provide the latitude or longitude, throw an error
    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    //calculate the distance
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                //where the geoNear should calculate the distance from
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                //the name of the field where the calculated distance will be stored
                distanceField: 'distance',
                //the unit of the distance
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });

});

exports.getAllTours = factory.getAll(Tour);
// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     // const tour = await Tour.findOne({ _id: req.params.id });
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
// })

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.creatTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {

//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//     })
// });



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'easy' } }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
        { $unwind: '$startDates' },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
})


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
    //destructure the url to get the distance, latlng and unit from the url
    const { distance, latlng, unit } = req.params;
    //destruct the latlng to get the latitude and longitude
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    //if user didn't provide the latitude or longitude, throw an error
    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }



    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    });

    //log the distance, lat and lng to the console
    console.log({ distance, lat, lng, unit });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

