const Tour = require('../models/tourModel');

class APIFeature {
    constructor(query, queryString) {
        this.query = query;
        // console.log("🚀 ~ file: tourController.js:6 ~ APIFeature ~ constructor ~ query:", query)
        this.queryString = queryString;
    }

    filter() {

        //1A) Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering 
        let queryStr = JSON.stringify(queryObj);
        //replacet the lt, lte, gt, gte with $lt, $lte, $gt, $gte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        //make queryStr to be a object
        queryStr = JSON.parse(queryStr);

        this.query = this.query.find(queryStr);

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            //default sorting
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            //default limiting
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        //4) Pagination
        // page=2&limit=10  
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // //page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

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

