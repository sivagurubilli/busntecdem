const responsesCommon = require('../../common/response.common');
const sessions = require("../../models").sessions;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */




async function sessionHandler(req, res) {
    try{
        const images = req.files;

        for (const image of images) {
            const newImage = await sessions.create({
                    user_id: "",
                    session_name: "",
                    status: "",
                    session_url: image.filename,
                    description: ""
            });

        }

        return res.status(200).send('Sessions uploaded successfully!');

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
module.exports = sessionHandler