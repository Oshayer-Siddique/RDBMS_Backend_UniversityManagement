const db = require('../Config/db');


async function enrollMultipleTeachers(req, res) {
    const { course_id, teacher_ids } = req.body;

    if (!course_id || !Array.isArray(teacher_ids) || teacher_ids.length === 0) {
        return res.status(400).json({ message: 'Course ID and an array of Teacher IDs are required.' });
    }

    try {
        // Check if the course exists
        const [courseResults] = await db.promise().query('SELECT * FROM course WHERE course_id = ?', [course_id]);
        if (courseResults.length === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if all teachers exist
        const [teacherResults] = await db.promise().query('SELECT teacher_id FROM teacher WHERE teacher_id IN (?)', [teacher_ids]);
        const existingTeacherIds = teacherResults.map(teacher => teacher.teacher_id);

        // Find missing teacher IDs
        const missingTeacherIds = teacher_ids.filter(id => !existingTeacherIds.includes(id));
        if (missingTeacherIds.length > 0) {
            return res.status(404).json({ message: `Teachers not found: ${missingTeacherIds.join(', ')}` });
        }

        // Proceed with enrollment for valid teachers
        const enrollmentData = teacher_ids.map(teacher_id => [teacher_id, course_id]);
        const enrollSql = 'INSERT INTO teacher_enroll (teacher_id, course_id) VALUES ?';

        await db.promise().query(enrollSql, [enrollmentData]);
        res.status(201).json({ message: 'Teachers enrolled successfully' });
    } catch (error) {
        console.error('Error enrolling teachers:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function unenrollTeacher(req, res) {
    const { teacher_id, course_id } = req.body;

    // Validate input
    if (!teacher_id || !course_id) {
        return res.status(400).json({ message: 'Teacher ID and Course ID are required.' });
    }

    // Delete the enrollment record
    const unenrollSql = 'DELETE FROM teacher_enroll WHERE teacher_id = ? AND course_id = ?';
    db.query(unenrollSql, [teacher_id, course_id], (err, result) => {
        if (err) {
            console.error('Error unenrolling teacher:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json({ message: 'Teacher unenrolled successfully' });
    });
}


module.exports = {
    enrollMultipleTeachers,
    unenrollTeacher,

}