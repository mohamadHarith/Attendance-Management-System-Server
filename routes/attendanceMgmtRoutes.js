const express = require('express');
const {attendanceMgmtController} = require('../controllers');

const router = express.Router();

router.get('/classList', attendanceMgmtController.classList);
router.get('/subjectList', attendanceMgmtController.subjectList);
router.get('/classList/classSessionList/:classID', attendanceMgmtController.classSessionList);
router.post('/studentsAttendance', attendanceMgmtController.studentsAttendance)


module.exports = router;