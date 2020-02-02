const db = require('./config');
const moment = require('moment');

const retrieveFaceEnrolmentStatus = async (studentID)=>{
   try{
        return await db.select('Face_Enrolment_Status').from('Student').where('Student_ID', studentID);
   }catch(error){
       throw new Error(error.message);
   }
}

const setStudentFaceData = async(studentID, faceDescriptor)=>{
    try{
        // return await db('Student Face Data').insert({
        //     Student_ID: studentID,
        //     Face_Descriptor: faceDescriptor,
        //     Face_Image_Path: studentImagePath 
        // })
        // .returning('Student_ID');
        return await db('Student').update({'Face_Descriptor': faceDescriptor, 'Face_Enrolment_Status':true}).where('Student_ID', studentID);
    }catch(error){
        throw new Error(error.message);
    }
}

const getStudentFaceData = async(studentID)=>{
    try{
        return await db.select('Face_Descriptor', 'Student_Name').from('Student').where('Student_ID', studentID);
    }catch(error){
        
        throw new Error(error.message);
        
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
        'Class Session.Start_Time','Class Session.End_Time', 
        'Subject.Subject_Name', 'Subject.Subject_ID',
        'Class.Type', 'Class.Section', 'Class.Class_ID',
        'Venue.Venue_ID', 'Venue.Name as Venue_Name'
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
        throw new Error(error.message);  
    }
}

const getCurrentTrimester = async(studentID)=>{
    try{
        return await db.select(
        'Trimester.Name as Trimester_Name', 'Trimester.Start_Date as Trimester_Start_Date',  
        'Trimester.End_Date as Trimester_End_Date',
        )
        .from('Enrolment')
        .innerJoin('Trimester', 'Enrolment.Trimester_ID', 'Trimester.Trimester_ID')
        .where('Enrolment.Student_ID', studentID)
    }catch(error){
        throw new Error(error.message);  
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
        throw new Error(error.message);
    }
}

const getStudentAttendanceData = async(studentID, classSessionID)=>{
    try{
        return await db.select('*').from('Attendance')
        .where('Class_Session_ID', classSessionID)
        .where('Student_ID', studentID)
    }catch(error){
        throw new Error(error.message);  
    }
}

const setStudentAttendance = async(studentID, classID, classSessionID, attendanceStatus)=>{
    try{
        return await db('Attendance').insert({
            Class_Session_ID: classSessionID,
            Class_ID: classID,
            Student_ID: studentID,
            Attendance_Status: attendanceStatus
        })
        .returning('Attendance_ID');
    }catch(error){
        throw new Error(error.message);
    }
}

const getNumberOfClassSessions = async(classID)=>{
    try{
        return await db('Class Session').count('Class_ID').where('Class_ID', classID);
    }catch(error){
        throw new Error(error.message);
    }
}

const getNumberOfStudentAttendance = async(classID, studentID)=>{
    try{
        return await db('Attendance').count('Class_ID')
        .where('Class_ID', classID)
        .where('Student_ID', studentID)
    }catch(error){
        throw new Error(error.message);
    }
}

const getEnrolledClassList = async(studentID)=>{
    try{
        return await db.select('Class.Class_ID', 'Class.Type', 'Class.Section', 'Subject.Subject_ID', 'Subject.Subject_Name')
        .from('Enrolment')
        .innerJoin('Class', 'Enrolment.Class_ID', 'Class.Class_ID')
        .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID')
        .where('Enrolment.Student_ID', studentID)
    }catch(error){
        throw new Error(error.message);
    }
}

const getAttendanceForClassSessions = async(classID, studentID)=>{
    try{
        return await db.select(
           'Class Session.Class_ID', 'Class Session.Class_Session_ID', 'Class Session.Date as Class_Session_Date', 
            'Class Session.Start_Time as Class_Session_Start_Time', 'Class Session.End_Time as Class_Session_End_Time',
            'Class Session.Venue_ID', 'Trimester.Start_Date as Trimester_Start_Date',
            'Attendance.Attendance_ID', 'Attendance.Attendance_Status'
        )
        .from('Class Session')
        .innerJoin('Enrolment', 'Class Session.Class_ID', 'Enrolment.Class_ID')
        .innerJoin('Trimester', 'Enrolment.Trimester_ID', 'Trimester.Trimester_ID')
        .leftOuterJoin('Attendance', 'Class Session.Class_Session_ID', 'Attendance.Class_Session_ID')
        .where('Trimester.Start_Date', '<', new Date())
        .where('Trimester.End_Date', '>', new Date())
        .where('Enrolment.Student_ID', studentID)
        .where('Enrolment.Class_ID', classID)
    }catch(error){
        throw new Error(error.message);
    }
}

const getCurrentTrimesterID = async()=>{
    try{
        return await db.select('Trimester_ID', 'Start_Date').from('Trimester')
        .where('Start_Date', '<', new Date())
        .where('End_Date', '>', new Date())
    }catch(error){
        throw new Error(error.message);
    }
}

const getListOfClassSessionsBetweenDate = async(studentID, startDate, EndDate)=>{
    try{
        return await db.select(
            'Enrolment.Student_ID', 'Enrolment.Class_ID', 'Class.Class_ID', 'Class.Subject_ID', 
            'Class.Type', 'Class.Section', 'Subject.Subject_ID', 'Subject.Subject_Name', 
            'Class Session.Venue_ID', 'Class Session.Date', 'Class Session.Start_Time', 
            'Class Session.End_Time'
            )
            .from('Class Session')
            .innerJoin('Class', 'Class Session.Class_ID', 'Class.Class_ID')
            .innerJoin('Subject', 'Class.Subject_ID', 'Subject.Subject_ID')
            .innerJoin('Enrolment', 'Class.Class_ID', 'Enrolment.Class_ID')
            .where('Enrolment.Student_ID', studentID)
            .whereBetween('Class Session.Date', [startDate, EndDate])
    }catch(error){
        throw new Error(error.message);
    }
}

const authUser = async(studentID, password)=>{
    try{
        return await db.select('Student_Name', 'Student_ID')
        .from('Student')
        .where('Student_ID', studentID)
        .where('Student_Password', password)
    }catch(error){
        throw new Error(error.message);
    }
}





module.exports = {
    retrieveFaceEnrolmentStatus, 
    setStudentFaceData, 
    getStudentFaceData, 
    getUpcomingClassSessions,
    getCheckInPermission,
    getStudentAttendanceData,
    setStudentAttendance,
    getNumberOfClassSessions,
    getNumberOfStudentAttendance,
    getEnrolledClassList, 
    getAttendanceForClassSessions,
    getCurrentTrimesterID,
    getListOfClassSessionsBetweenDate,
    getCurrentTrimester,
    authUser
};

// const test = async ()=>{ 
//     const data = await authUser(1151101633,  'HRwillsucceed9719$');
//     console.log(data);
    
// }

// test();