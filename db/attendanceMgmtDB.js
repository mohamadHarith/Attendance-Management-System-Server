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

// const getStudentsAttendance = async(classSessionID)=>{
//   try{
//     return await db.select(
//       //'Student.Student_ID', 
//       //'Student.Student_Name',
//       'Class Session.Class_ID', 
//       'Class Session.Class_Session_ID', 
//       //'Attendance.Attendance_Status',
//       //'Attendance.Attendance_ID'
//     )
//     .from('Class Session')
//     .where('Class Session.Class_Session_ID', classSessionID)
//     // .innerJoin('Enrolment', 'Class Session.Class_ID', 'Enrolment.Class_ID')
//     // .innerJoin('Student', 'Enrolment.Student_ID', 'Student.Student_ID')
//     // .leftOuterJoin('Attendance', 'Student.Student_ID', 'Attendance.Student_ID')
//     // .orderBy('Student.Student_Name')
//   }catch(e){
//     throw new Error(e.messgae);
//   }
// }



const getStudentsAttendance = async(classSessionID)=>{
  try{
    return await db.select('Student.Student_ID', 'Student.Student_Name',
    'Class Session.Class_ID', 'Class Session.Class_Session_ID', 
    'Attendance.Attendance_Status','Attendance.Attendance_ID'
    )
    .from('Enrolment')
    .innerJoin('Student', 'Enrolment.Student_ID', 'Student.Student_ID')
    .innerJoin('Class Session', 'Enrolment.Class_ID', 'Class Session.Class_ID')
    .leftOuterJoin('Attendance', function(){
      this.on('Student.Student_ID', 'Attendance.Student_ID')
      this.on('Class Session.Class_Session_ID', 'Attendance.Class_Session_ID')
    })
    .where('Class Session.Class_Session_ID', classSessionID)
  }catch(e){
    throw new Error(e.messgae);
  }
}

const updateAttendance = async(studentID, classSessionID, classID, attendanceStatus)=>{
  try{
    const attendanceData = await db.select('*').from('Attendance').where('Student_ID', studentID).where('Class_Session_ID', classSessionID).where('Class_ID', classID);
    if(attendanceData.length > 0){
      await db('Attendance').update({
        Attendance_Status: attendanceStatus
      })
      .where('Student_ID', studentID)
      .where('Class_ID', classID)
      .where('Class_Session_ID', classSessionID)
      .returning('Attendance_ID')
    }
    else{
      await db('Attendance').insert({
        Student_ID:studentID,
        Attendance_Status:attendanceStatus,
        Class_ID:classID,
        Class_Session_ID:classSessionID
      })
      .returning('Attendance_ID')
    }
  }catch(e){
    console.log(e);
    throw new Error(e.messgae);
  }
}

const setCheckInPermission = async(classSessionID, checkinPermisison)=>{
  try{
    await db('Class Session').update({
      Permit_Check_In: checkinPermisison
    })
    .where('Class_Session_ID', classSessionID)

  }catch(e){
    console.log(e);
    throw new Error(e.messgae);
  }
}



// (async ()=>{ 
//   const result = await setCheckInPermission(12, 'true');  
//   console.log(result);
// })();

module.exports = {
  retrieveClassList, 
  retrieveSubjectList,
  retrieveClassSessionList,
  getStudentsAttendance,
  updateAttendance,
  setCheckInPermission
}