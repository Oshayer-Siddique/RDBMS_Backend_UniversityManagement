const db = require("../Config/db");

async function getGradesByStudentAndCourse(req, res) {
    const { student_id, course_id } = req.params;
    const sql = 'SELECT * FROM grade WHERE student_id = ? AND course_id = ?';

    try {
        const [results] = await db.promise().query(sql, [student_id, course_id]);
        if (results.length > 0) {
            const gradeData = results[0];
            const totalMarks = gradeData.quiz1_marks + gradeData.quiz2_marks + gradeData.quiz3_marks + gradeData.assignments_marks + gradeData.attendance_marks + gradeData.mid_sem_marks + gradeData.final_sem_marks;

            // Call the PL/SQL function to calculate the grade
            const [gradeResult] = await db.promise().query('SELECT calculate_grade(?, ?, ?, ?, ?, ?, ?) AS grade', [
                gradeData.quiz1_marks,
                gradeData.quiz2_marks,
                gradeData.quiz3_marks,
                gradeData.assignments_marks,
                gradeData.attendance_marks,
                gradeData.mid_sem_marks,
                gradeData.final_sem_marks
            ]);

            const grade = gradeResult[0].grade;

            res.json({ ...gradeData, total_marks: totalMarks, grade });
        } else {
            res.status(404).json({ error: 'Grades not found' });
        }
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to retrieve grades' });
    }
}

async function getCoursesByStudent(req, res) {
    const { student_id } = req.params;
    const sql = 'SELECT course.course_id, course.title FROM course JOIN student_enroll ON course.course_id = student_enroll.course_id WHERE student_enroll.student_id = ?';

    try {
        const [results] = await db.promise().query(sql, [student_id]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to retrieve courses' });
    }
}

async function assignGrade(req, res) {
    const { student_id, course_id, quiz1_marks, quiz2_marks, quiz3_marks, assignments_marks, attendance_marks, mid_sem_marks, final_sem_marks } = req.body;

    // Check if the student is enrolled in the course
    const enrollmentSql = 'SELECT * FROM student_enroll WHERE student_id = ? AND course_id = ?';
    try {
        const [enrollmentResults] = await db.promise().query(enrollmentSql, [student_id, course_id]);
        if (enrollmentResults.length === 0) {
            return res.status(404).json({ error: 'Student is not enrolled in the course' });
        }

        // Calculate total marks by choosing the best 3 among the quiz and assignments
        const quizMarks = [parseInt(quiz1_marks, 10), parseInt(quiz2_marks, 10), parseInt(quiz3_marks, 10)];
        const bestQuizMarks = quizMarks.sort((a, b) => b - a).slice(0, 3);
        const totalMarks = bestQuizMarks.reduce((a, b) => a + b, 0) + parseInt(assignments_marks, 10) + parseInt(attendance_marks, 10) + parseInt(mid_sem_marks, 10) + parseInt(final_sem_marks, 10);

        // Insert the grade into the grade table
        const insertGradeSql = `
            INSERT INTO grade (student_id, course_id, quiz1_marks, quiz2_marks, quiz3_marks, assignments_marks, attendance_marks, mid_sem_marks, final_sem_marks, total_marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            quiz1_marks = VALUES(quiz1_marks),
            quiz2_marks = VALUES(quiz2_marks),
            quiz3_marks = VALUES(quiz3_marks),
            assignments_marks = VALUES(assignments_marks),
            attendance_marks = VALUES(attendance_marks),
            mid_sem_marks = VALUES(mid_sem_marks),
            final_sem_marks = VALUES(final_sem_marks),
            total_marks = VALUES(total_marks)
        `;
        await db.promise().query(insertGradeSql, [student_id, course_id, quiz1_marks, quiz2_marks, quiz3_marks, assignments_marks, attendance_marks, mid_sem_marks, final_sem_marks, totalMarks]);
        res.status(201).json({ message: 'Grade assigned successfully' });
    } catch (error) {
        console.error('Error assigning grade:', error);
        res.status(500).json({ error: 'Failed to assign grade' });
    }
}

async function updateGrade(req, res) {
    const { student_id, course_id, quiz1_marks, quiz2_marks, quiz3_marks, assignments_marks, attendance_marks, mid_sem_marks, final_sem_marks } = req.body;

    // Check if the grade entry exists
    const gradeSql = 'SELECT * FROM grade WHERE student_id = ? AND course_id = ?';
    try {
        const [gradeResults] = await db.promise().query(gradeSql, [student_id, course_id]);
        if (gradeResults.length === 0) {
            return res.status(404).json({ error: 'Grade entry not found' });
        }

        // Calculate total marks by choosing the best 3 among the quiz and assignments
        const quizMarks = [parseInt(quiz1_marks, 10), parseInt(quiz2_marks, 10), parseInt(quiz3_marks, 10)];
        const bestQuizMarks = quizMarks.sort((a, b) => b - a).slice(0, 3);
        const totalMarks = bestQuizMarks.reduce((a, b) => a + b, 0) + parseInt(assignments_marks, 10) + parseInt(attendance_marks, 10) + parseInt(mid_sem_marks, 10) + parseInt(final_sem_marks, 10);

        // Update the grade in the grade table
        const updateGradeSql = `
            UPDATE grade
            SET quiz1_marks = ?, quiz2_marks = ?, quiz3_marks = ?, assignments_marks = ?, attendance_marks = ?, mid_sem_marks = ?, final_sem_marks = ?, total_marks = ?
            WHERE student_id = ? AND course_id = ?
        `;
        await db.promise().query(updateGradeSql, [quiz1_marks, quiz2_marks, quiz3_marks, assignments_marks, attendance_marks, mid_sem_marks, final_sem_marks, totalMarks, student_id, course_id]);
        res.status(200).json({ message: 'Grade updated successfully' });
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Failed to update grade' });
    }
}

async function getAllGrades(req, res) {
    try {
        const [results] = await db.promise().query('SELECT student_id, course_id FROM grade');
        res.json(results);
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to retrieve grades' });
    }
}

module.exports = { getGradesByStudentAndCourse, getCoursesByStudent, assignGrade, updateGrade, getAllGrades };