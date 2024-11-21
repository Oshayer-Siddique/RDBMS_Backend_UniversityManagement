const express = require('express');
const router = express.Router();

const { getAllCourses,getCourseById,
    createCourse,deleteCourse,updateCourse } = require('../Controllers/courseController');





router.get('/', getAllCourses);
router.post('/create',createCourse);
router.get('/read/:id',getCourseById);
router.put('/update/:id',updateCourse);
router.delete('/delete/:id',deleteCourse);

module.exports = router;
