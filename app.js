const morgan = require('morgan');
const express = require('express');
const { error } = require('console');
const { get } = require('http');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
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

// 4) START SERVER
module.exports = app;