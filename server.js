const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
// get port from env
const port = process.env.PORT || 3000;

//log env
// console.log(process.env);


app.listen(port, () => {
    console.log(`app running on port ${port}...`)
});
