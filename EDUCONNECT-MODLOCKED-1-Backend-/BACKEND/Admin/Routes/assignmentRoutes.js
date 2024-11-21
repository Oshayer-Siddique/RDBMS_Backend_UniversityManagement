const express = require('express');
const router = express.Router();

const assignmentController = require('../Controllers/assignmentController');
const notificationController = require('../Controllers/notificationController');


const {upload} = assignmentController;
router.post('/create', upload.single('file'), assignmentController.createAssignment);

router.get('/students/:studentId/notifications',notificationController.getNotificationsForStudent);



module.exports = router;