const db = require("../Config/db");
const express = require('express');
const router = express.Router();


// Send a message
router.post('/send', (req, res) => {
    const { course_id, student_id, content } = req.body;

    if (!course_id || !student_id || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO messages (course_id, student_id, content, timestamp) VALUES (?, ?, ?, NOW())';
    db.query(query, [course_id, student_id, content], (err, results) => {
        if (err) {
            console.error(err); // Log the error to the console
            return res.status(500).json({ error: 'Failed to send message' });
        }
        res.status(201).json({ message: 'Message sent successfully' });
    });
});

// Get messages for a specific course
router.get('/:course_id', (req, res) => {
    const { course_id } = req.params;

    const query = 'SELECT * FROM messages WHERE course_id = ? ORDER BY timestamp ASC';
    db.query(query, [course_id], (err, results) => {
        if (err) {
            console.error(err); // Log the error to the console
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
        res.status(200).json(results);
    });
});
  module.exports = router;