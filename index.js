const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware to make session user data available in all EJS templates
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn || false;
    next();
});


// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const indexRoutes = require('./routes/index');


// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/file', fileRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
