const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    
    destination: 'upload/resumeUpload',
    filename: (req, file, cb) => {
        console.log('file', file)
        // cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const uploadResume = multer({
    storage: storage
})


module.exports = uploadResume

