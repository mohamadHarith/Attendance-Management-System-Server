const studentDB = require ('../db/studentDB');
const {faceRecognitionServices} = require('./faceRecognitionServices');
const path = require('path');
const moment = require('moment');


const checkFaceEnrolment = async (studentID)=>{
    try{
        return await studentDB.retrieveFaceEnrolmentStatus(studentID);
    }catch(e){
        throw new Error(e.message);
    }
}

const enrolFace = async (uploadedImagesFile, studentID)=>{
    
   try{
        const picture01Path = path.join(__dirname, '../', uploadedImagesFile.picture01[0].path);
        const picture02Path = path.join(__dirname, '../', uploadedImagesFile.picture02[0].path);
        const picture03Path = path.join(__dirname, '../', uploadedImagesFile.picture03[0].path);
        
        const faceRecognitionService = await new faceRecognitionServices();
        const enroledFaceDescriptors = [];
        
        await enroledFaceDescriptors.push(await faceRecognitionService.getFaceDescriptor(picture01Path));
        await enroledFaceDescriptors.push(await faceRecognitionService.getFaceDescriptor(picture02Path));
        await enroledFaceDescriptors.push(await faceRecognitionService.getFaceDescriptor(picture03Path));    

        //console.log(enroledFaceDescriptors);
        const JSONDescriptor = await JSON.stringify(enroledFaceDescriptors);

        return await studentDB.setStudentFaceData(studentID, JSONDescriptor);

   }catch(error){
        throw new Error(error.message);
   }
}

const recogniseFace = async(queryImageFile, studentID)=>{
    try{
        console.log(queryImageFile);
        console.log(studentID);
        const queryImagePath =  path.join(__dirname, '../', queryImageFile.path);
        const faceRecognitionService = await new faceRecognitionServices();
        
        const queryDescriptor = await faceRecognitionService.getFaceDescriptor(queryImagePath);
        const rawRefDesc = await studentDB.getStudentFaceData(studentID);
        const refDescriptors = rawRefDesc[0].Face_Descriptor.map((data)=>{
            return new Float32Array(Object.values(data));
        });
        
        return await faceRecognitionService.isFaceMatch(queryDescriptor, refDescriptors, rawRefDesc[0].Student_Name);

    }catch(error){
        console.log(error.message);
        
        throw new Error(error.message);
    }
}

const getUpcomingClassSessions = async(studentID)=>{
    try{
        
        let data = {
            weekData:{},
            upcomingClassSessions:[]
        }

        const upcomingClassSessionsData = await studentDB.getUpcomingClassSessions(studentID);
        
        if(upcomingClassSessionsData.length>0){            
            data.weekData.Trimester_Name = upcomingClassSessionsData[0].Trimester_Name;
            data.weekData.Week = moment(upcomingClassSessionsData[0].Date)
            .diff(moment(upcomingClassSessionsData[0].Trimester_Start_Date), 'weeks')+1;
            data.weekData.Day_Of_Week = moment(upcomingClassSessionsData[0].Day_Of_Week).format('dddd');
            data.weekData.Date = moment(upcomingClassSessionsData[0].Date).format('DD MMM YYYY');

            upcomingClassSessionsData.forEach((item)=>{
                item.Start_Time = moment(item.Start_Time).format('hh:mma');
                item.End_Time = moment(item.End_Time).format('hh:mma');
                delete(item.Trimester_Name);
                delete(item.Week);
                delete(item.Day_Of_Week);
                delete(item.Date);
                delete(item.Trimester_Start_Date);
                delete(item.Trimester_End_Date);
            });

            data.upcomingClassSessions = upcomingClassSessionsData;
        }
        return data;
        
    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const getCheckInPermission = async(studentID, classSessionID )=>{
    try{
        //1. Check if class session is ongoing
        //2. Check the check in permision of the class session
        const isCheckinAllowed = await studentDB.getCheckInPermission(classSessionID);
        let checkInMessage = {
            message: '',
            permission: false
        };
        if(isCheckinAllowed.length == 1){
            //3. Check if the student already checked in to the class session
            const hasStudentCheckedIn = await studentDB.getStudentAttendanceData(studentID, classSessionID);
            if(hasStudentCheckedIn.length == 0){
                // //set attendance
                // const result = await studentDB.setStudentAttendance(studentID, classSessionID, 'Present');
                // if (result.length == 1){
                //     checkInMessage.message = 'Succesfully checked in.'
                //     checkInMessage.success = true;
                //     return checkInMessage;
                // }
                // else {
                //     checkInMessage.message = 'Something went wrong.'
                //     checkInMessage.success = false;
                //     return checkInMessage;
                // }
                checkInMessage.message = ''
                checkInMessage.permission = true;
                return checkInMessage;
            }
            else{
                checkInMessage.message = 'You have already checked in for this class session.'
                checkInMessage.permission = false;
                return checkInMessage;
            }
        }
        else{
            checkInMessage.message = 'You are not allowed to check in for this class session at this time'
            checkInMessage.permission = false;
            return checkInMessage;
        }

    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const setStudentAttendance = async(studentID, classSessionID, attendanceStatus)=>{
    try{
         //set attendance
        let queryResult = {
            message: '',
            querySuccessful: false
        }
         const result = await studentDB.setStudentAttendance(studentID, classSessionID, attendanceStatus);
           if (result.length == 1){
              queryResult.message = 'Succesfully checked in.'
              queryResult.querySuccessful = true;
              return queryResult;
           }
            else {
               queryResult.message = 'Something went wrong.'
               queryResult.querySuccessful = false;
                return queryResult;
        } 
    }catch(error){

    }
}

module.exports={
    checkFaceEnrolment, 
    enrolFace, 
    recogniseFace, 
    getUpcomingClassSessions,
    getCheckInPermission,
    setStudentAttendance
}

// const test = async ()=>{ 
//         console.log(await checkIn('1151101633', 6));
// }
    
// test();

