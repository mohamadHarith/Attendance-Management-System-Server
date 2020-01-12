const {attendanceMgmtDB} = require('../db');

const getClassList = async ()=>{
        try {
          return await attendanceMgmtDB.retrieveClassList();
        } catch(e) {
          throw new Error(e.message);
        }
        
}

const getSubjectList = async ()=>{
  try{
    return await attendanceMgmtDB.retrieveSubjectList();
  }catch(e){
    throw new Error(e.message);
  }
}

const getClassSessionList = async (classID)=>{
  try{
    const classSession =  await attendanceMgmtDB.retrieveClassSessionList(classID);
    if(classSession.length > 0){
      return classSession;
    }
    else{
      throw new Error('Could not retrieve class session data');
    }
  }catch(e){
    throw new Error(e.message);
  }
}

const getStudentsAttendance = async(classSessionID)=>{
  try{
    const studentList = await attendanceMgmtDB.getStudentsAttendance(classSessionID);
    if (studentList.length>0){
      return studentList;
    }
    else {
      throw new Error('No student list data found')
    }
  }catch(e){
    throw new Error(e.message);
  }
}

// (async ()=>{
//   console.log(await getClassList());
// })();

module.exports = {
  getClassList, 
  getSubjectList,
  getClassSessionList,
  getStudentsAttendance
}