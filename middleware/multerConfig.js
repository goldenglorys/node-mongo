const multer = require('multer');
const path = require('path')
const cryptoRandomString = require('crypto-random-string')

const dest = './public/uploads/avatars';

const coverDest = './public/uploads/course_coverpicture';

//Setup storage for our uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname == 'avatar'){
            cb(null, dest);            
        }
        if (file.fieldname == 'coverpicture') {
            cb(null, coverDest);
        }
    },

    // By default, multer removes file extensions so let's add them back
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + cryptoRandomString(12) + path.extname(file.originalname))
    }
})


//Function to limit the type of file to be uploaded
const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only images files with jpeg, png and gif extensions are allowed!';
        return cb(new Error(req.fileValidationError), false)
    }
    cb(null, true);
}


  let upload = multer({
    storage: storage, 
    fileFilter: imageFilter, 
    limits: { //Limit the filesize to 4MB
    fileSize: 4 * 1024 * 1024,
  }
})
module.exports = upload