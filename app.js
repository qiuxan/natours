const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const { error } = require('console');
const { get } = require('http');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
})

//request time middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {

    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        result: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours
        }
    })
}
// 2) ROUTE HANDLERS
const getTour = (req, res) => {

    const id = +req.params.id;

    const tour = tours.find(t => t.id === id);
    if (!tour) return res.status(404).json({
        status: "fail",
        message: "Invalid ID"
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const creatTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })

}

const updateTour = (req, res) => {

    if (+req.params.id > tours.length) return res.status(404).json({
        status: "fail",
        message: "Invalid ID"
    });

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

const deleteTour = (req, res) => {
    if (+req.params.id > tours.length) return res.status(404).json({
        status: "fail",
        message: "Invalid ID"
    });

    res.status(204).json({
        status: 'success',
        data: null
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

// getUser updateUser deleteUser functions
const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    })
}

// 3) ROUTES


const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/')
    .get(getAllTours)
    .post(creatTour);

tourRouter.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


userRouter.route('/').get(getAllUsers).post(createUser);


userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);
// 4) START SERVER
const port = 3000;

app.listen(port, () => {
    console.log(`app running on port ${port}...`)
});
