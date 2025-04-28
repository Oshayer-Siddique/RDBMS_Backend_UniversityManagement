const express = require('express');
const router = express.Router();
const { getGradesByStudentAndCourse, 
        getCoursesByStudent, 
        assignGrade, 
        updateGrade, 
        getAllGrades } = require('../Controllers/gradeController');

router.get('/grades/:student_id/:course_id', getGradesByStudentAndCourse);
router.get('/courses/:student_id', getCoursesByStudent);
router.post('/assign-grade', assignGrade);
router.put('/update-grade', updateGrade);
router.get('/all-grades', getAllGrades);

module.exports = router;