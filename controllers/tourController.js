const Tour = require('../models/tourModel');


exports.getAllTours = async (req, res) => {

    try {

        // BUILD QUERY
        //get a hard copy of query object
        //1A) Filtering
        let queryObj = { ...req.query };
        console.log("🚀 ~ file: tourController.js:11 ~ exports.getAllTours= ~ req.query:", req.query)
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        // console.log("🚀 ~ file: tourController.js:14 ~ exports.getAllTours= ~ queryStr:", queryStr)
        //replacet the lt, lte, gt, gte with $lt, $lte, $gt, $gte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log("🚀 ~ file: tourController.js:14 ~ exports.getAllTours= ~ queryStr:", queryStr)

        //make queryStr to be a object
        queryStr = JSON.parse(queryStr);

        const query = Tour.find(queryStr);
        // console.log("🚀 ~ file: tourController.js:14 ~ exports.getAllTours= ~ query:", query)

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