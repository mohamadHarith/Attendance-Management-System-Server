const {attendanceMgmtServices} = require('../services');
const {attendanceMgmtDB} = require('../db');

const classList = async(req, res)=>{
    try {
      res.json(await attendanceMgmtServices.getClassList());  
      // console.log(getClassList());
      } catch(e) {
        console.log(e.message)
        res.sendStatus(500);
      }
}

const subjectList = async(req, res)=>{
  try{
    res.json(await attendanceMgmtServices.getSubjectList());
  }catch(e){
    console.log(e.message)
    res.sendStatus(500);
  }
}

const classSessionList = async(req, res)=>{
  try{
    const classID = req.params.classID;
    res.json(await attendanceMgmtServices.getClassSessionList(classID));
  }catch(e){
    console.log(e)
    res.sendStatus(500);
  }
}

const studentsAttendance = async(req, res)=>{
  try{
    console.log('Request for student list has been made');    
    const {classSessionID} = req.body;
    const studentList = await attendanceMgmtServices.getStudentsAttendance(classSessionID);
    // console.log(studentList);    
    res.json(studentList);
  }catch(e){
    console.log(e);
    res.sendStatus(500);    
  }
}

const updateAttendance = async(req, res)=>{
  try{
    console.log('Request for update attendance has been made');    
    const {studentID, classSessionID, classID, attendanceStatus} = req.body;
    await attendanceMgmtDB.updateAttendance(studentID, classSessionID, classID, attendanceStatus);
    res.sendStatus(200);
  }catch(e){
    console.log(e);
    res.sendStatus(500);    
  }
}

// const setCheckInPermission = async(req, res)=>{
//   try{
//     console.log('Request for update check in permission has been made');    
//     const {checkInPermission} = req.body;
//     await attendanceMgmtDB.setCheckInPermission();
//     res.sendStatus(200);
//   }catch(e){
//     console.log(e);
//     res.sendStatus(500);    
//   }
// }




module.exports = {
  classList, 
  subjectList,
  classSessionList,
  studentsAttendance,
  updateAttendance,

}