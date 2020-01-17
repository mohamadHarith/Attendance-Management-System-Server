const studentDB = require ('../db/studentDB');
const {faceRecognitionServices} = require('./faceRecognitionServices');
const path = require('path');
const moment = require('moment');


const checkFaceEnrolment = async (studentID)=>{
    try{
        return await studentDB.retrieveFaceEnrolmentStatus(studentID);
    }catch(e){
        console.log(error.message);
        
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

const setStudentAttendance = async(studentID, classID, classSessionID, attendanceStatus)=>{
    try{
         //set attendance
        let queryResult = {
            message: '',
            querySuccessful: false
        }
         const result = await studentDB.setStudentAttendance(studentID, classID, classSessionID, attendanceStatus);
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
        console.log(error.message);
        throw new Error(error.message);
    }
}

const getAttendancePercentage = async(studentID, classID)=>{
    try{
        const numberofClassSessions = await studentDB.getNumberOfClassSessions(classID);
        const numberofAttendance = await studentDB.getNumberOfStudentAttendance(classID, studentID);
        const attendancePercentage = {
            numberOfClassSessionsAttended: numberofAttendance[0].count,
            numberOfTotalClassSessions: numberofClassSessions[0].count,
            percentage: (parseInt(numberofAttendance[0].count)/parseInt(numberofClassSessions[0].count))*100
        }
        return attendancePercentage;
    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const getAttendanceData = async(studentID)=>{
    try{
        const attendanceData = await studentDB.getEnrolledClassList(studentID).then(async (classList)=>{
            if(classList.length > 0){
                
                for(var i=0; i<classList.length; i++){
                    //const attendanceData = await studentDB.getAttendanceForClassSessions(classList[i].Class_ID, studentID);
                    const attendancePercentage = await getAttendancePercentage(studentID, classList[i].Class_ID);
                    classList[i].numberOfClassSessions = attendancePercentage.numberOfTotalClassSessions;
                    classList[i].numberOfClassSessionsAttended = attendancePercentage.numberOfClassSessionsAttended;
                    classList[i].attendancePercentage = attendancePercentage.percentage;
                }
                return classList;
            }
            else{
                throw new Error('Something went wrong');
            }
            
        })
        return attendanceData;
    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const getAttendanceDetails = async(classID, studentID)=>{
    try{
        const attendanceDetails =  await studentDB.getAttendanceForClassSessions(classID, studentID);
        if(attendanceDetails.length>0){
            attendanceDetails.forEach((item)=>{
                item.Class_Session_Start_Time = moment(item.Class_Session_Start_Time).format('hh:mma');
                item.Class_Session_End_Time = moment(item.Class_Session_End_Time).format('hh:mma');
                item.Week = moment(item.Class_Session_Date).diff(moment(item.Trimester_Start_Date), 'weeks')+1;
                item.Day = moment(item.Class_Session_Date).format('dddd')
                item.Class_Session_Date = moment( item.Class_Session_Date).format('DD MMM YYYY');
                if(item.Attendance_Status == null){
                    item.Attendance_Status = 'Absent'
                }
                delete(item.Trimester_Start_Date);
            });

        }
        return attendanceDetails;
        
    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const getScheduleForCurrentWeek = async (studentID)=>{
    try{
        //get current week
        //get  first date of the week
        //add 5 days for the last date of the week
        const currentTrimester = await studentDB.getCurrentTrimesterID();

        const currentWeek =  moment(new Date()).diff(moment(currentTrimester[0].Start_Date), 'weeks');

        //const firstDateOfTheWeek = moment(currentTrimester[0].Start_Date).add(currentWeek, 'w').format('DD/MM/YYYY');
        //const lastDateOfTheWeek = moment(firstDateOfTheWeek).add(4, 'd').format('DD/MM/YYYY');

        const firstDateOfTheWeek = moment(currentTrimester[0].Start_Date).add(currentWeek, 'w').toDate();
        const lastDateOfTheWeek = moment(firstDateOfTheWeek).add(4, 'd').toDate();

        const listOfClassSessionsBetweenDate = await studentDB.getListOfClassSessionsBetweenDate(studentID, firstDateOfTheWeek, lastDateOfTheWeek)

        listOfClassSessionsBetweenDate.forEach((item)=>{
            item.Day = moment(item.Date).format('dddd');
            item.Date = moment(item.Date).format('DD/MM/YYYY');
            item.Start_Time = moment(item.Start_Time).format('hh:mma');
            item.End_Time = moment(item.End_Time).format('hh:mma');
        })

        let mondayClasses = {
            name: 'Monday',
            classes: []
        }
        let tuesdayClasses = {
            name: 'Tuesday',
            classes: []
        }
        let wednesdayClasses = {
            name: 'Wednesday',
            classes: []
        }
        let thursdayClasses = {
            name: 'Thursday',
            classes: []
        }
        let fridayClasses = {
            name: 'Friday',
            classes: []
        }

        for(var i=0; i<listOfClassSessionsBetweenDate.length; i++){
            if(listOfClassSessionsBetweenDate[i].Day == 'Monday'){
                mondayClasses.classes.push(listOfClassSessionsBetweenDate[i]);
            }
           else if(listOfClassSessionsBetweenDate[i].Day == 'Tuesday'){
                tuesdayClasses.classes.push(listOfClassSessionsBetweenDate[i]);
            }
           else if(listOfClassSessionsBetweenDate[i].Day == 'Wednesday'){
                wednesdayClasses.classes.push(listOfClassSessionsBetweenDate[i]);
            }
           else if(listOfClassSessionsBetweenDate[i].Day == 'Thursday'){
                thursdayClasses.classes.push(listOfClassSessionsBetweenDate[i]);
            }
           else if(listOfClassSessionsBetweenDate[i].Day == 'Friday'){
                fridayClasses.classes.push(listOfClassSessionsBetweenDate[i]);
            }            
        }

        let scheduleData = [];

        if(mondayClasses.classes.length>0){
            scheduleData.push(mondayClasses);
        }
        if(tuesdayClasses.classes.length>0){
            scheduleData.push(tuesdayClasses);
        }
        if(wednesdayClasses.classes.length>0){
            scheduleData.push(wednesdayClasses);
        }
        if(thursdayClasses.classes.length>0){
            scheduleData.push(thursdayClasses);
        }
        if(fridayClasses.classes.length>0){
            scheduleData.push(fridayClasses);
        }
        

        return scheduleData;



    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}

const authUser = async(studentID, password)=>{
    try {
        const result = await studentDB.authUser(studentID, password);
        return result;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

module.exports={
    checkFaceEnrolment, 
    enrolFace, 
    recogniseFace, 
    getUpcomingClassSessions,
    getCheckInPermission,
    setStudentAttendance,
    getAttendancePercentage,
    getAttendanceData,
    getAttendanceDetails,
    getScheduleForCurrentWeek,
    authUser
}

// const test = async ()=>{ 
//    console.log( await getScheduleForCurrentWeek(1151101633));
   
// }
    
// test();

