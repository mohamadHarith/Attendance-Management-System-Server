const {faceRecognitionServices} = require('./faceRecognitionServices');
const path = require('path');

//multiple reference image allows better face recognition
const referenceImagePath1 = path.join(__dirname, '../', './studentImages/1151101633/1151101633_picture01.jpg');
const referenceImagePath2 = path.join(__dirname, '../', './studentImages/1151101633/1151101633_picture02.jpg');
const queryImagePath = path.join(__dirname, '../', './studentImages/1151101633/1151101633_picture03.jpg');

const test = async()=>{
    const test = await new faceRecognitionServices();
   
    //this array could be saved to database and retrieved on demand
    const refImageDescArray = []
    await refImageDescArray.push(await test.getFaceDescriptor(referenceImagePath1));
    // await refImageDescArray.push(await test.getFaceDescriptor(referenceImagePath2));
    
    
    // const queryImageDesc =  await test.getFaceDescriptor(queryImagePath);

    // const result = await test.isFaceMatch(queryImageDesc, refImageDescArray, 'John Doe');
    // console.log(result);

    //console.log(path.join(__dirname, '../', './studentImages/1151101633/1151101633_picture03.jpg'));
    
    

}

test();

