const Tour = require('../models/tourModel');


exports.getAllTours = async (req, res) => {

    try {

        // BUILD QUERY
        //get a hard copy of query object
        //1A) Filtering
        const queryObj = { ...req.query };
        console.log("🚀 ~ file: tourController.js:11 ~ exports.getAllTours= ~ req.query:", req.query)
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        //replacet the lt, lte, gt, gte with $lt, $lte, $gt, $gte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        //make queryStr to be a object
        queryStr = JSON.parse(queryStr);

        let query = Tour.find(queryStr);

        //2) Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            //default sorting
            query = query.sort('-createdAt');
        }

        //3) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            //default limiting
            query = query.select('-__v');
        }
        //4) Pagination
        // page=2&limit=10  
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        // //page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
        query = query.skip(skip).limit(limit);


        // EXECUTE QUERY
        const tours = await query;

        // // use mongoose query methods
        // const tours = await Tour.find()
        //     .where('duration').equals(duration)
        //     .where('difficulty').equals(difficulty);

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err // todo: change this message to be more specific
        })
    }

}
exports.getTour = async (req, res) => {

    try {

        const tour = await Tour.findById(req.params.id);
        // const tour = await Tour.findOne({ _id: req.params.id });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err // todo: change this message to be more specific
        })
    }

    // const id = +req.params.id;
    // const tour = tours.find(t => t.id === id);
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // })
}
exports.creatTour = async (req, res) => {



    try {

        // const newTour = new Tour(req.body);
        // await newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!' // todo: change this message to be more specific
        })
    }


}
exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }


}
exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }






    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // })
}

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
} 