const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const connection = require('../config/db');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueKey = uuid.v4(); // Generate unique key
        cb(null, uniqueKey + path.extname(file.originalname)); // Save file with unique key and original extension
    }
});
const upload = multer({ storage });


// File Upload Route
router.post('/upload', isAuthenticated, upload.single('file'), (req, res) => {
    const uniqueKey = uuid.v4();
    const fileExtension = path.extname(req.file.originalname); // Get original extension
    const fileName = uniqueKey + fileExtension; // Create file name with unique key and extension
    const filePath = path.join('uploads', fileName);
    const userId = req.session.user.id;

    // Rename file with uniqueKey and extension
    fs.rename(req.file.path, path.join('./uploads', fileName), (err) => {
        if (err) return res.send('Error renaming file');

        // Save the file path and unique key in the database
        const query = 'INSERT INTO files (user_id, file_path, unique_key) VALUES (?, ?, ?)';
        connection.query(query, [userId, filePath, uniqueKey], (err, result) => {
            if (err) {
                return res.send('Error uploading file');
            }
            res.send(`File uploaded successfully. Unique Key: ${uniqueKey}`);
        });
    });
});


// File Download Route (GET)
router.get('/download', (req, res) => {
    const { uniqueKey } = req.query; // Get the unique key from query parameters

    if (!uniqueKey) {
        return res.send('Please provide a unique key.');
    }

    // Query the database to get the file path using the unique key
    const query = 'SELECT file_path FROM files WHERE unique_key = ?';
    connection.query(query, [uniqueKey], (err, results) => {
        if (err || results.length === 0) {
            return res.send('File not found in database');
        }

        const filePath = path.join(__dirname, '../', results[0].file_path); // Get the full path

        console.log('Attempting to download file from:', filePath); // Debugging line

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log('Error:', err); // Log the error for debugging
                return res.send('File not found');
            }

            // If file exists, send it as a download
            res.download(filePath, (err) => {
                if (err) {
                    return res.send('Error downloading file');
                }
            });
        });
    });
});


module.exports = router;
