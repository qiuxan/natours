const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const { error } = require('console');

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


// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', creatTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(creatTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


// 4) START SERVER
const port = 3000;

app.listen(port, () => {
    console.log(`app running on port ${port}...`)
});
