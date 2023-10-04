const path = require('path');
const morgan = require('morgan');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');//Data sanitization against NoSQL query injection
const xss = require('xss-clean');//Data sanitization against XSS
const hpp = require('hpp');//Prevent parameter pollution
// require cookie-parser
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//import reviewRouter
const reviewRouter = require('./routes/reviewRoutes');
//import viewRouter
const viewRouter = require('./routes/viewRoutes');
//import bookingRouter
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

//set template engine pug
app.set('view engine', 'pug');
//set views 
app.set('views', path.join(__dirname, 'views'));


//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// 1)GLOBAL MIDDLEWARES
//implement CORS
app.use(cors());

// app.use(cors({
//     origin: 'https://www.natours.com'
// })); // only allow cross url access from this domain


app.options('*', cors());

// app.options('/api/v1/tours/:id', cors());// only allow cross url access to this route to delete and update tour


//set security HTTP headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'cdnjs.cloudflare.com', 'api.mapbox.com', 'js.stripe.com'],
        'script-src-elem': ["'self'", 'js.stripe.com', 'https://js.stripe.com'],
    }
}));
//if it is in development mode, then use morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//compress all text sent to clients
app.use(compression());

//limit requests from same IP
const limiter = rateLimit({
    max: 100, //max number of requests from same IP
    windowMs: 60 * 60 * 1000, //max number of requests from same IP in 1 hour
    message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp(
    {
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    }
));


//request time middleware 
//test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // req.headers
    // req.cookies
    // console.log("🚀 ~ file: app.js:87 ~ app.use ~ req.cookies:", req.cookies)
    // console.log("🚀 ~ file: app.js:25 ~ app.use ~  req.headers:", req.headers)
    next();
})

// 3) ROUTES
//use viewRouter
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
//use reviewRouter
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// create a route for note defined routes
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

//create a error handling middleware
app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;