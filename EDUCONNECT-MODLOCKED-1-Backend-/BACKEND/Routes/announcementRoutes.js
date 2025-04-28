const express = require('express');
const router = express.Router();

const { createAnnouncement, getAllAnnouncements, deleteAnnouncement, getAnnouncementByCourseID } = require('../Controllers/announcementController');

router.get('/', getAllAnnouncements);
router.post('/create', createAnnouncement);
router.delete('/:announcement_id/:course_id', deleteAnnouncement);
router.get('/course/:course_id', getAnnouncementByCourseID); // New route

module.exports = router;
