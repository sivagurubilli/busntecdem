const multer = require('multer')
const path = require('path')

// Upload File Configuration

const storage = multer.diskStorage({
    destination: 'upload/companylogo',
    filename: (req, file, cb) => {
        console.log('file1111', file)
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const uploadCompanyLogo = multer({
    storage: storage
})


module.exports = uploadCompanyLogo

