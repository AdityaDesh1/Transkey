const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../config/db');
const router = express.Router();

// Signup Route (GET)
router.get('/signup', (req, res) => {
    res.render('signup',{ loggedIn: req.session.loggedIn });  // Renders signup.ejs
});

// Signup Route (POST)
router.post('/signup', (req, res) => {
    const { email, fullname, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send('Passwords do not match');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.send('Error hashing password');
        }

        const query = 'INSERT INTO users (email, fullname, username, password) VALUES (?, ?, ?, ?)';
        connection.query(query, [email, fullname, username, hashedPassword], (err, result) => {
            if (err) {
                return res.send('Error creating user');
            }
            res.redirect('/auth/login');
        });
    });
});

// Login Route (GET) - This is where you serve login.ejs
router.get('/login', (req, res) => {
    res.render('login', {loggedIn: req.session.loggedIn});  // Renders login.ejs
});

// Login Route (POST)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, result) => {
        if (err || result.length === 0) {
            return res.send('Invalid username or password');
        }

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.send('Invalid username or password');
            }

            req.session.loggedIn = true;
            req.session.user = result[0];
            res.redirect('/service');
        });
    });
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

// Service Page Route (GET)
router.get('/service', (req, res) => {
    if (req.session.loggedIn) {
        res.render('service', { loggedIn: req.session.loggedIn });
    } else {
        res.redirect('/auth/login');
    }
});


module.exports = router;
