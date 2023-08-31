//import fs
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//import Tour model
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

// rocess.env.DATABASE
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
//read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// console.log("🚀 ~ file: import-dev-data.js:25 ~ tours:", tours)


// eslint-disable-next-line no-unused-vars
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

//delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}
console.log("🚀 ~ file: import-dev-data.js:51 ~ process.argv:", process.argv)

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}   
