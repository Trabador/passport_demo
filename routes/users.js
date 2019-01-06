const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Register
router.get('/register', (req, res) => {
    res.render('register');
});

//Login
router.get('/login', (req, res) => {
    const email = req.flash('email')[0];//get email data if already typed
    res.render('login', {
        email
    });
});

//Handle Register Request
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = checkData(name, email, password, password2);
    const newUSer = User({
        name,
        email,
        password
    });

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email
        });
    }
    else{
        bcrypt.genSalt(10, (err, salt) => {
            //Hash password
            bcrypt.hash(newUSer.password, salt, (err, hash) => {
                if(err) throw err;
                //Set password hashed
                newUSer.password = hash;
                //Save to DB
                newUSer.save()
                    .then(() => {
                        req.flash('success_msg', 'You can now log in');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            });
        });
    }
});

function checkData(name, email, password, password2){
    const errors =  [];
    if(name == ''){
        errors.push({message: 'Please enter a name'});
    }
    if(email == ''){
        errors.push({message: 'Please enter a valid email'});
    }
    if(password == ''){
        errors.push({message: 'Please enter a password'});
    }
    else{
        if(password2 == ''){
            errors.push({message: 'Please confirm password'});
        }
        else{
            if(password != password2){
                errors.push({message: 'password must match'});
            }
        }
    }    
    return errors;
}

//Handle Login request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err);}
    
        if(!user) { 
            req.flash('error', info.message);
            req.flash('email', req.body.email);
            return res.redirect('/users/login'); 
        }
        req.logIn(user, (err) => {
            if(err) { return next(err);}
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'Success Logout');
    res.redirect('/users/login');
});


module.exports = router;