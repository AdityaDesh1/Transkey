function isAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        return next();
    } else {
        res.send('Please log in to upload files.');
    }
}

module.exports = isAuthenticated;
