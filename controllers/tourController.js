const Tour = require('../models/tourModel');


exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // result: tours.length,
        // data: {
        //     tours
        // }
    })
}
exports.getTour = (req, res) => {

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
exports.updateTour = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}
exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    })
}