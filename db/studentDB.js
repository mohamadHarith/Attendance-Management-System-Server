const db = require('./config');
const moment = require('moment');

const retrieveFaceEnrolmentStatus = async (studentID)=>{
    return await db.select('Face_Enrolment_Status').from('Student').where('Student_ID', studentID);
}

const setStudentFaceData = async(studentID, faceDescriptor)=>{
    try{
        // return await db('Student Face Data').insert({
        //     Student_ID: studentID,
        //     Face_Descriptor: faceDescriptor,
        //     Face_Image_Path: studentImagePath 
        // })
        // .returning('Student_ID');
        return await db('Student').update({'Face_Descriptor': faceDescriptor}).where('Student_ID', studentID);
    }catch(error){
        throw new Error(error.message)
    }
}

const getStudentFaceData = async(studentID)=>{
    try{
        return await db.select('Face_Descriptor', 'Student_Name').from('Student').where('Student_ID', studentID);
    }catch(error){
        console.log(error.message);
        
    }
}

// const retrieveClassSessionList = async (classID) => {
//     try{
//       return await db.select('Class.Class_ID','Subject.Subject_ID', 'Subject.Subject_Name','Class Session.Week', 'Class Session.Date', 'Class Session.Day_Of_Week', 
//       'Class Session.Start_Time', 'Class Session.End_Time', 'Class Session.Venue_ID','Class Session.Schedule_Status')
//       .from('Class Session')
//       .innerJoin('Class', 'Class Session.Class_ID', 'Class.Class_ID')
//       .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID')
//       .where('Class Session.Class_ID', classID);
//     }catch(e){
//       throw new Error(e.message)
//     }
//   }

const getUpcomingClassSessions = async(studentID)=>{
    try{
        return await db.select(
        'Trimester.Name as Trimester_Name', 'Trimester.Start_Date as Trimester_Start_Date',  
        'Trimester.End_Date as Trimester_End_Date','Class Session.Class_Session_ID', 
        'Class Session.Class_ID','Class Session.Date', 
        // 'Class Session.Week',
        'Class Session.Start_Time','Class Session.End_Time', 
        'Subject.Subject_Name', 
        'Class.Type', 'Class.Section', 'Venue.Venue_ID', 
        'Venue.Name as Venue_Name'
        )
        .from('Enrolment')
        .innerJoin('Trimester', 'Enrolment.Trimester_ID', 'Trimester.Trimester_ID')
        .innerJoin('Class', 'Enrolment.Class_ID', 'Class.Class_ID')
        .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID')
        .innerJoin('Class Session', 'Class.Class_ID', 'Class Session.Class_ID')
        .innerJoin('Venue', 'Class Session.Venue_ID', 'Venue.Venue_ID')
        .where('Enrolment.Student_ID', studentID)
        .where('Class Session.Date', new Date())
        .where('Class Session.End_Time', '>', new Date())  
    }catch(error){
        console.log(error.message);  
    }
}

const getCheckInPermission = async(classSessionID)=>{
    try{
        return await db.select('*').from('Class Session')
        .where('Class_Session_ID', classSessionID)
        .where('Permit_Check_In', true)
        .where('Date', new Date())
        .where('Start_Time', '<', new Date())
        .where('End_Time', '>', new Date()) 
    }catch(error){
        console.log(error.message);  
    }
}

const getStudentAttendanceData = async(studentID, classSessionID)=>{
    try{
        return await db.select('*').from('Attendance')
        .where('Class_Session_ID', classSessionID)
        .where('Student_ID', studentID)
    }catch(error){
        console.log(error.message);  
    }
}

const setStudentAttendance = async(studentID, classSessionID, attendanceStatus)=>{
    try{
        return await db('Attendance').insert({
            Class_Session_ID: classSessionID,
            Student_ID: studentID,
            Attendance_Status: attendanceStatus
        })
        .returning('Attendance_ID');
    }catch(error){
        console.log(error.message); 
    }
}


module.exports = {
    retrieveFaceEnrolmentStatus, 
    setStudentFaceData, 
    getStudentFaceData, 
    getUpcomingClassSessions,
    getCheckInPermission,
    getStudentAttendanceData,
    setStudentAttendance
};

// const test = async ()=>{ 
//     const data = await setStudentAttendance('1151101633', '6', 'Present');
//     console.log(data);
    
// }

// test();