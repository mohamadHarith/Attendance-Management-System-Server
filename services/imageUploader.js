const multer = require('multer');
const fs = require('fs');

class imageUploader{
	constructor(id){
		let storage;
		if(id == 1){
			//storage engine for enrol face 
			storage = multer.diskStorage({
				destination: (req, file, cb)=>{
					const path = `./studentImages/${req.body.studentID}`;
					fs.mkdirSync(path, { recursive: true }, (err) => {
						if (err) throw err;
					});
					cb(null, path);
				},
				filename: (req, file, cb)=>{
					let extArray = file.mimetype.split("/");
					let extension = extArray[extArray.length - 1];	
					if(extension == 'jpeg'){extension = 'jpg'}
					cb(null, req.body.studentID + '_' + file.fieldname + '.' + extension);
				}			
			});
		}
		else if(id == 2){
			//storage engine for scan face
			storage = multer.diskStorage({
				destination: (req, file, cb)=>{
					const path = `./cache/${req.body.studentID}`;
					fs.mkdirSync(path, { recursive: true }, (err) => {
						if (err) throw err;
					});
					cb(null, path);
				},
				filename: (req, file, cb)=>{
					let extArray = file.mimetype.split("/");
					let extension = extArray[extArray.length - 1];	
					if(extension == 'jpeg'){extension = 'jpg'}
					cb(null, req.body.studentID + '.' + extension);
				}			
			});
		}		
		this.uploader = multer({storage: storage});
	}
	
}

module.exports = {imageUploader}