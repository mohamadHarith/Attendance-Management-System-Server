const faceapi = require('face-api.js');
const path = require('path');
const fs = require('fs');
const {createCanvas, Image, Canvas} = require('canvas');
const http = require('http');
faceapi.env.monkeyPatch({Canvas, Image})

class faceRecognitionServices{

    //asynchronous constructor
    constructor() {
        return (async () => {
           await this.loadModels();
            return this; 
        })();
    }
    
    //a function to load models
    async loadModels(){
        const modelURL = path.join(__dirname, '../', './models');
        await faceapi.nets.tinyFaceDetector.loadFromDisk(modelURL);
        await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(modelURL);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelURL);
    }
    
    //a funtion that returns Float32Array of face descriptor of an image
    //arguments - imagePath: String
    async getFaceDescriptor(imagePath){    
        try{
            const imageFile = await fs.readFileSync(imagePath);        
            //create canvas
            const canvas = createCanvas(900, 900);
            const ctx = canvas.getContext('2d');
            const img = new Image()
            img.onload = async() => ctx.drawImage(img, 0, 0)
            img.onerror = err => { throw err }
            img.src = imageFile            
            //face detection
            const option = new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.6
            });
            const useTinyModel = true;
            const faceDescriptor = await faceapi
            .detectSingleFace(canvas, option)
            .withFaceLandmarks(useTinyModel)
            .withFaceDescriptor();
            //console.log(faceDescriptor);        
            return faceDescriptor.descriptor;
        }catch(error){
            console.log(error);
            
            throw new Error(error.message)
        }
    }

   //a function that returns true if referenceFace and queryFace matches
   //arguments: queryImageFaceDescriptor : Float32Array of query face descriptor
   //referenceImageFaceDescriptor: Array of Float32Arrays of reference face descriptors
   //referenceImageFaceName: String
    async isFaceMatch(queryImageFaceDescriptor, referenceImageFaceDescriptors, referenceImageFaceName){        
        const labeledDescriptors = await new faceapi.LabeledFaceDescriptors(referenceImageFaceName, referenceImageFaceDescriptors);
        //console.log(labeledDescriptors);
        const faceMatcher = await new faceapi.FaceMatcher(labeledDescriptors, 0.5);
        const result = await faceMatcher.findBestMatch(queryImageFaceDescriptor);
        console.log(result) ;
        
        if(result._label == referenceImageFaceName && result._distance < 0.5){
            return true
        }
        else return false;
   }
}

module.exports = {faceRecognitionServices}

// http.createServer(function (req, res) {
//     res.write('<html><body>');
//     res.write('<img src="' + queryImageCanvas.toDataURL() + '" />');
//     res.write('</body></html>');
//     res.end();
// }).listen(8124, "127.0.0.1");
// console.log('Server running at http://127.0.0.1:8124/');