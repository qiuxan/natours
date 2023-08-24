const fs = require('fs');

const express = require('express');
const { error } = require('console');

const app = express();
app.use(express.json());
// app.get('/', (req, res) => {
//     res.status(200).json({ message: '{hello from the server side}', app: "Natourss" });
// });

// app.post('/', (req, res) => {
//     res.send('you can post to this endpoint...');
// }); 

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {

    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
});

app.get('/api/v1/tours/:id', (req, res) => {

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
});

app.post('/api/v1/tours', (req, res) => {
    console.log(req.body);

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

});

//i want a patch request to update the tour with the given id
app.patch('/api/v1/tours/:id', (req, res) => {

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
});

const port = 3000;

app.listen(port, () => {
    console.log(`app running on port ${port}...`)
});
