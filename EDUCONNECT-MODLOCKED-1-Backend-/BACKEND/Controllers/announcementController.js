const db = require("../Config/db");

async function getAllAnnouncements(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM announcement');
        res.json(results);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to retrieve announcements' });
    }
}

function createAnnouncement(req, res) {
    const sql = 'INSERT INTO announcement (course_id, title, description) VALUES (?, ?, ?)';
    const { course_id, title, description } = req.body;

    // Validate input
    if (!course_id || !title || !description) {
        return res.status(400).json({ message: 'Course ID, Title, and Description are required.' });
    }

    // Check if the course_id exists in the student_enroll table
    db.query('SELECT * FROM student_enroll WHERE course_id = ?', [course_id], (err, results) => {
        if (err) {
            console.error('Error checking course_id:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Course ID does not exist.' });
        }

        // Proceed to insert the announcement with auto-incremented announcement_id
        db.query(sql, [course_id, title, description], (err, result) => {
            if (err) {
                console.error('Error inserting announcement:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }
            res.status(201).json({
                announcement_id: result.insertId,
                course_id,
                title,
                description
            });
        });
    });
}

function deleteAnnouncement(req, res) {
    const { announcement_id, course_id } = req.params;
    const sql = 'DELETE FROM announcement WHERE announcement_id = ? AND course_id = ?';

    // Validate input
    if (!announcement_id || !course_id) {
        return res.status(400).json({ message: 'Announcement ID and Course ID are required.' });
    }

    db.query(sql, [announcement_id, course_id], (err, result) => {
        if (err) {
            console.error('Error deleting announcement:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully.' });
    });
}

// New function to get announcements by course ID
async function getAnnouncementByCourseID(req, res) {
    const { course_id } = req.params;

    try {
        const [results] = await db.promise().query('SELECT * FROM announcement WHERE course_id = ?', [course_id]);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'No announcements found for the given course ID' });
        }
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to retrieve announcements' });
    }
}

module.exports = { createAnnouncement, deleteAnnouncement, getAllAnnouncements, getAnnouncementByCourseID };
