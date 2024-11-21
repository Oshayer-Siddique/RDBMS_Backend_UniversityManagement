const db = require('../Config/db');


async function enrollMultipleStudents(req, res) {
    const { course_id, student_ids } = req.body;

    if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({ message: 'Course ID and an array of Student IDs are required.' });
    }

    try {
        // Check if the course exists
        const [courseResults] = await db.promise().query('SELECT * FROM course WHERE course_id = ?', [course_id]);
        if (courseResults.length === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if all students exist
        const [studentResults] = await db.promise().query('SELECT student_id FROM student WHERE student_id IN (?)', [student_ids]);
        const existingStudentIds = studentResults.map(student => student.student_id);

        // Find missing student IDs
        const missingStudentIds = student_ids.filter(id => !existingStudentIds.includes(id));
        if (missingStudentIds.length > 0) {
            return res.status(404).json({ message: `Students not found: ${missingStudentIds.join(', ')}` });
        }

        // Proceed with enrollment for valid students
        const enrollmentData = student_ids.map(student_id => [student_id, course_id]);
        const enrollSql = 'INSERT INTO student_enroll (student_id, course_id) VALUES ?';

        await db.promise().query(enrollSql, [enrollmentData]);
        res.status(201).json({ message: 'Students enrolled successfully' });
    } catch (error) {
        console.error('Error enrolling students:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function unenrollStudent(req, res) {
    const { student_id, course_id } = req.body;

    // Validate input
    if (!student_id || !course_id) {
        return res.status(400).json({ message: 'Student ID and Course ID are required.' });
    }

    // Delete the enrollment record
    const unenrollSql = 'DELETE FROM student_enroll WHERE student_id = ? AND course_id = ?';
    db.query(unenrollSql, [student_id, course_id], (err, result) => {
        if (err) {
            console.error('Error unenrolling student:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json({ message: 'Student unenrolled successfully' });
    });
}


module.exports = {
    enrollMultipleStudents,
    unenrollStudent,

}