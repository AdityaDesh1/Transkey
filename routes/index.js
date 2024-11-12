const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('home', { loggedIn: req.session.loggedIn, page: 'home' });
});

// Service page route
router.get('/service', (req, res) => {
    res.render('service', { loggedIn: req.session.loggedIn, page: 'service' });
});

// Uploads page route (only accessible when logged in)
router.get('/uploads', (req, res) => {
    if (req.session.loggedIn) {
        res.render('uploads', { loggedIn: req.session.loggedIn, page: 'uploads' });
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;
