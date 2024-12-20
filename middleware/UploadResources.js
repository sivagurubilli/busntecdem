const multer = require('multer')
const path = require('path')
let count = 0
// Upload File Configuration

const storage = multer.diskStorage({
    destination: 'upload/images',
    filename: (req, file, cb) => {
        count++
        cb(null, 'BO_Resource' + "_" + Date.now() + path.extname(file.originalname))
    }
})

const externalSource = multer({
    storage: storage
})

    
module.exports = externalSource

