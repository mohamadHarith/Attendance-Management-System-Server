const db = require('./config');

const retrieveClassList = async () => {
    try {
        return await db.select('Subject.Subject_ID', 'Subject.Subject_Name', 'Class.Class_ID','Class.Type', 'Class.Section')
        .from('Class')
        .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID');
      } catch(e) {
        throw new Error(e.message);
      }
}

const retrieveSubjectList = async () => {
  try{
    return await db.select('*')
    .from('Subject')
  }catch(e){
    throw new Error(e.message);
  }
}


const retrieveClassSessionList = async (classID)=>{
  try{
    return await db.select('Trimester.Start_Date as Trimester_Start_Date',
    'Class.Class_ID', 'Subject.Subject_ID', 'Subject.Subject_Name','Class Session.Class_Session_ID',
    'Class Session.Date','Class Session.Start_Time', 'Class Session.End_Time', 'Class Session.Venue_ID'
    )
    .from('Enrolment')
    .innerJoin('Trimester', 'Enrolment.Trimester_ID', 'Trimester.Trimester_ID')
    .innerJoin('Class', 'Enrolment.Class_ID', 'Class.Class_ID')
    .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID')
    .innerJoin('Class Session', 'Class.Class_ID', 'Class Session.Class_ID')
    .where('Enrolment.Class_ID', classID )
  }catch(e){
    throw new Error(e.message)
  }
}

const getStudentsAttendance = async(classSessionID)=>{
  try{
    return await db.select('Enrolment.Student_ID', 'Student.Student_Name',
    'Class Session.Class_ID', 'Class Session.Class_Session_ID', 
    'Attendance.Attendance_Status','Attendance.Attendance_ID'
    )
    .from('Class Session')
    .innerJoin('Enrolment', 'Class Session.Class_ID', 'Enrolment.Class_ID')
    .innerJoin('Student', 'Enrolment.Student_ID', 'Student.Student_ID')
    .leftOuterJoin('Attendance', 'Class Session.Class_Session_ID', 'Attendance.Class_Session_ID')
    .where('Class Session.Class_Session_ID', classSessionID)
  }catch(e){
    throw new Error(e.messgae);
  }
}


// (async ()=>{ 
//   const result = await getStudentsAttendance(6);  
//   console.log(result);
// })();

module.exports = {
  retrieveClassList, 
  retrieveSubjectList,
  retrieveClassSessionList,
  getStudentsAttendance
}