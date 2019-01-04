const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config/enviroment');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');

const app = express();

//Midleware
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body Parser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//Mongoose DB
moongose.connect(config.DB, { useNewUrlParser: true })
    .then(() => console.log('Connected to the DB') )
    .catch((err) => console.log(err) );

//Routes
app.use('/', indexRouter);
app.use('/users', userRouter);


app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});