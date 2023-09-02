const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeatures');

exports.getAllTours = async (req, res) => {

    try {


        // EXECUTE QUERY

        // req.query

        const features = new APIFeature(Tour.find(), req.query).filter().sort().paginate();

        // const tours = await query;

        const tours = await features.query;


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

