const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Register
router.get('/register', (req, res) => {
    res.render('register');
});

//Login
router.get('/login', (req, res) => {
    res.render('login');
});

//Handle Register Request
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    const newUSer = User({
        name,
        email,
        password
    });
    bcrypt.genSalt(10, (err, salt) => {
        //Hash password
        bcrypt.hash(newUSer.password, salt, (err, hash) => {
            if(err) throw err;
            //Set password hashed
            newUSer.password = hash;
            //Save to DB
            newUSer.save()
                .then(() => {
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
        });
    });
});

//Handle Login request
router.post('/login', (req, res) => {
    const { email , password } = req.body;
    console.log(email, password);
    res.send('test');
});

module.exports = router;