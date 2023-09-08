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