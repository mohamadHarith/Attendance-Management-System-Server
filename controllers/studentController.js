const {studentServices} = require('../services');
const path = require('path');


const checkFaceEnrolment = async(req, res)=>{
    try{
        const studentID = req.body.studentID;
        const faceEnrolmentStatus = await studentServices.checkFaceEnrolment(studentID);
        res.json(faceEnrolmentStatus);
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);
    }
}

const enrolFace = async(req, res)=>{
    try{
        console.log('Request to enrol face has been made');        
        const result = await studentServices.enrolFace(req.files, req.body.studentID);
       if(result){ 
           res.status(200).send();
        }
        else{
            throw new Error('Something went wrong');
        }
    }catch(e){
        console.log(e);
        res.status(500).json(e.message);        
    }
}

const getStudentImage = async(req, res)=>{
    try{
        const {studentID} = req.params;
        const imagePath = path.join(__dirname, '../', `./studentImages/${studentID}/${studentID}_picture01.jpg`);
        res.status(200).sendFile(imagePath);
    }catch(error){
        console.log(error);
        res.status(500).json(error.message);  
    }
}

const scanFace = async(req, res)=>{
    try{
        console.log('Request to scan face has been made'); 
        const result = await studentServices.recogniseFace(req.file, req.body.studentID); 
        if(result){
            res.status(200).json({didFaceMatch: true});
        }
        else{
            res.status(200).json({didFaceMatch: false});
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error.message);     
    }
}

const getUpcomingClassSessions = async(req, res)=>{
    try{
        console.log('Request for upcoming class has been made'); 
        const {studentID} = req.body;        
        const data = await studentServices.getUpcomingClassSessions(studentID);
        
        if(data.upcomingClassSessions.length > 0){
            res.json(data);
        }
        else{
            throw new Error('No upcoming class sessions found');
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error.message); 
    }
}

const getCheckInPermission = async(req, res)=>{
    try{
        console.log('Request for check in permission has been made');
        const {studentID, classSessionID} = req.body;
        const result = await studentServices.getCheckInPermission(studentID, classSessionID);
        res.json(result);
    }catch(error){
        console.log(error);
        res.status(500).json(error.message); 
    }
}

const setStudentAttendance = async(req, res)=>{
    try{
        console.log('Request to set attendance has been made');
        const {studentID, classSessionID, classID, attendanceStatus} = req.body;
        const result = await studentServices.setStudentAttendance(studentID, classID, classSessionID, attendanceStatus);
        res.json(result);
    }catch(error){
        console.log(error);
        res.status(500).json(error.message); 
    }
}

const getStudentAttendanceData = async(req, res)=>{
    try{
        console.log('Request for attendance data has been made');
        const {studentID} = req.params;
        const result = await studentServices.getAttendanceData(studentID);
        if(result.length>0){
            res.json(result);
        }
        else{
            throw new Error('Something went wrong');
        }
    }catch(e){
        console.log(error);
        res.status(500).json(error.message); 
    }
}

const getAttendanceDetails = async(req, res)=>{
    try{
        console.log('Request for attendance details has been made');
        const {classID, studentID} = req.params;
        const result = await studentServices.getAttendanceDetails(classID, studentID);
        if(result.length>0){
            res.json(result);
        }
        else{
            throw new Error('Something went wrong');
        }
    }catch(e){
        console.log(error);
        res.status(500).json(error.message)
        
    }
}

module.exports = {
    checkFaceEnrolment,
    enrolFace, 
    getStudentImage, 
    scanFace, 
    getUpcomingClassSessions,
    getCheckInPermission,
    setStudentAttendance,
    getStudentAttendanceData,
    getAttendanceDetails
}