const multer = require('multer')
const path = require('path')

// Upload File Configuration

const storage = multer.diskStorage({
    destination: 'upload/images',
    filename: (req, file, cb) => {
        try {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
            
        } catch (error) {
            console.error(error)
        }
    }
})

const upload = multer({
    storage: storage
})


module.exports = upload
