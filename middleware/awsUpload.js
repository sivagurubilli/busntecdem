const AWS = require("aws-sdk")

const uploadToS3 = async (file, bucketName, folderName) => {
    try {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        })
        const newFileName = `tecdemy_${(Date.now()).toString()}.${file.name.split(".")[1]}`
        const key = `${folderName}/${newFileName}`;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: file.data,
            
        }
        return new Promise((resolve, reject) => {
            s3.upload(params, {}, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    } catch (error) {
        console.error(error);
    }
}



const getFilesFromS3 = (fileName, folderPath) => {
    try {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
        
        const presignedURL = s3.getSignedUrl("getObject", {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folderPath}/${fileName}`,
            Expires: 100, 
            // ResponseContentDisposition: 'inline', 
            // ResponseContentType: 'application/pdf' 
        });

        return presignedURL;

    } catch (error) {
        console.error(error);
    }
}


const deleteFileFromS3 = (fileUrl) => {
    try {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        })

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileUrl,
        }
        return new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    } catch (error) {
        console.error(error);
    }
}



module.exports = {
    uploadToS3,
    getFilesFromS3,
    deleteFileFromS3
}
