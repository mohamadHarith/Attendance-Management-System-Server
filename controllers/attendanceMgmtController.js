const {attendanceMgmtServices} = require('../services');

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
    res.json(studentList);
  }catch(e){
    console.log(e);
    res.sendStatus(500);    
  }
}

module.exports = {
  classList, 
  subjectList,
  classSessionList,
  studentsAttendance
}