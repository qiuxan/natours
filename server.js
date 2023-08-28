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

console.log("🚀 ~ file: server.js:11 ~ DB:", DB)

const app = require('./app');
// get port from env
const port = process.env.PORT || 3000;

//log env
// console.log(process.env);

app.listen(port, () => {
    console.log(`app·running·on·port·${port}...`);
});
