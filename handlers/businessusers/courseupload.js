const responsesCommon = require('../../common/response.common');
const courseupload = require("../../models").courseupload;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */




async function courseuploadHandler(req, res) {
    try{
        const uploadablefiles = req.files;
        const textData = req.body

        for (const file of uploadablefiles) {
            const newCourse = await courseupload.create({
                
                user_id: "",
                course_title: textData.course_title,
                course_uploadDate:textData.course_uploadDate,
                course_fileURL: file.filename,
                course_type: textData.course_type,
                course_description: textData.course_type,
                course_url: textData.course_url,
                course_status: "",
                course_usertype: "",
                course_purchaseId: "",
            });
        }
        

            // const newCourse = await courseupload.create({
            //     user_id: "",
            //     course_title: textData.course_title,
            //     course_uploadDate:textData.course_uploadDate,
            //     course_type: textData.course_type,
            //     course_description: textData.course_type,
            //     course_url: textData.course_url,
            //     course_status: "",
            //     course_usertype: "",
            //     course_purchaseId: "",
            // });

        return res.status(200).send('Successfully Uploaded');

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
module.exports = courseuploadHandler