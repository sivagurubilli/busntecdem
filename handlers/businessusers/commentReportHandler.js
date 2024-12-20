const responsesCommon = require('../../common/response.common');
const commentReportDB = require("../../models").commentReport;
const { v4: uuidv4 } = require('uuid');

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */




async function commentReportHandler(req, res) {
    try {
        const { user_id, comment_id, reportReason, issue } = req.body
        req.body['uuid'] = uuidv4();
        const commentReport = await commentReportDB.create(req.body)
        if (!!commentReport) {
            return res.status(200).send(responsesCommon.formatSuccessMessage("Report has been submitted successfully!", 400, null));
        }
    } catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error?.message, 400, null));
    }
}

module.exports = commentReportHandler