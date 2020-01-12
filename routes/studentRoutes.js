const express = require('express');
const {studentController} = require('../controllers');
const {imageUploader} = require('../services/imageUploader');
const router = express.Router();

const enrolFaceUploader = new imageUploader(1);
const scanFaceUploader = new imageUploader(2);

router.post('/checkFaceEnrolment', studentController.checkFaceEnrolment);

router.post('/enrolFace', enrolFaceUploader.uploader.fields([
    {name: 'picture01', maxCount:1},
    {name: 'picture02', maxCount:1},
    {name: 'picture03', maxCount:1}]),
    studentController.enrolFace
);

router.get('/getStudentImage/:studentID', studentController.getStudentImage);

router.post('/scanFace', scanFaceUploader.uploader.single('scanFaceImage'), studentController.scanFace);

router.post('/upcomingClassSessions', studentController.getUpcomingClassSessions);

router.post('/checkInPermission', studentController.getCheckInPermission);

router.post('/setStudentAttendance', studentController.setStudentAttendance)


module.exports = router;