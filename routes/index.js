const express = require('express');
const router = express.Router();
const { checkIsAuth } = require('../config/auth');

//Index
router.get('/', (req, res) => {
    res.render('welcome');
});

//Dashboard
router.get('/dashboard', checkIsAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});

module.exports = router;