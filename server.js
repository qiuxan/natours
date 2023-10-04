process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message)
    process.exit(1);
});

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// connect to db
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true, // to fix deprecation warning
    })
    .then(() => console.log('DB connection successful!'));

const app = require('./app');
// get port from env
const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log(`app·running·on·port·${port}...`);
});

process.on('unhandledRejection', (err) => {
    // console.log("🚀 ~ file: server.js:30 ~ process.on ~ err:", err)
    console.log(err.name)
    console.log(err.message)
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});   