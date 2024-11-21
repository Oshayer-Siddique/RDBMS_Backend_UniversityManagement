const db = require('../Config/db');
const multer = require('multer');
const path = require('path');
const notificationController = require('./notificationController');


// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the upload directory
    },
    filename: (req, file, cb) => {
        
        cb(null, path.extname(file.originalname)); // Define unique file name
    }
});
const upload = multer({ storage: storage });

// Export upload middleware to use in routes
exports.upload = upload;

// Create a new assignment and notify all enrolled students in the course

exports.createAssignment = async (req, res) => {
    const { title, description, due_date, max_points, course_id } = req.body;
    const file = req.file;

    // Parse the data into the correct types
    const parsedCourseId = parseInt(course_id, 10);  // Convert course_id to a number
    const parsedMaxPoints = parseInt(max_points, 10);  // Convert max_points to a number
    const parsedDueDate = new Date(due_date);  // Convert due_date to a Date object

    if (isNaN(parsedCourseId)) {
        return res.status(400).json({ error: 'Course ID must be a valid number.' });
    }
    
    if (isNaN(parsedMaxPoints)) {
        return res.status(400).json({ error: 'Max points must be a valid number.' });
    }
    
    if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ error: 'Due date must be a valid date (YYYY-MM-DD HH:MM:SS).' });
    }
    try {
        // Insert the assignment into the database
        const [result] = await db.promise().query(
            'INSERT INTO assignment (course_id, title, description, due_date, max_points, file_path) VALUES (?, ?, ?, ?, ?, ?)',
            [
                parsedCourseId,
                title,
                description,
                parsedDueDate,  // Make sure it's inserted as a DATETIME
                parsedMaxPoints,
                file ? file.path : null // Save the file path or null if no file uploaded
            ]
        );

        // Notify students enrolled in the course (optional step)
        const assignmentId = result.insertId;
        const message = `New assignment created: ${title}`;
        await notificationController.notifyAllEnrolledStudents(parsedCourseId, message);

        res.json({
            message: 'Assignment created and notifications sent.',
            assignmentId: assignmentId,
            filePath: file ? file.path : null
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Failed to create assignment and send notifications.' });
    }
};






