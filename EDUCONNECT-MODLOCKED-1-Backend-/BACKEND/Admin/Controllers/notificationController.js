const db = require('../Config/db');

// Notify all students enrolled in a specific course when an assignment is created
exports.notifyAllEnrolledStudents = async (courseId, message) => {
    try {
        // Step 1: Get all students enrolled in the course
        const [students] = await db.promise().query(
            'SELECT student_id FROM student_enroll WHERE course_id = ?',
            [courseId]
        );

        // Step 2: Create notifications for each student
        const notificationPromises = students.map(student => {
            return db.promise().query(
                'INSERT INTO notifications (student_id, course_id, message) VALUES (?, ?, ?)',
                [student.student_id, courseId, message]
            );
        });

        // Wait for all notifications to be inserted
        const notificationResults = await Promise.all(notificationPromises);

        // Step 3: Log confirmation of each notification created
        const notificationsSent = notificationResults.map((result, index) => ({
            student_id: students[index].student_id,
            success: !!result[0].insertId // Insert ID indicates success
        }));

        console.log('Notifications sent to students:', notificationsSent);
        return notificationsSent; // Return results to confirm success for each student
    } catch (error) {
        console.error('Error notifying students:', error);
        throw new Error('Failed to send notifications to students');
    }
};


// Get all notifications for a specific student
exports.getNotificationsForStudent = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const [results] = await db.promise().query(
            'SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC',
            [studentId]
        );

        if (results.length === 0) {
            res.json({ message: 'No notifications found for this student.' });
        } else {
            res.json(results);
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

