const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config/enviroment');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
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


//Session 
app.use(session({
    secret: 'my_secret',
    resave: true,
    saveUninitialized: true
}));


//Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Passport
app.use(passport.initialize());
app.use(passport.session());

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