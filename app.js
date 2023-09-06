const morgan = require('morgan');
const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
//if it is in development mode, then use morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
//     console.log('Hello from the middleware');
//     next();
// })

//request time middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
// create a route for note defined routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    })

})

// 4) START SERVER
module.exports = app;