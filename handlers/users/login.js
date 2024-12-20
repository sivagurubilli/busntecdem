

const userServices = require('../../services/userservices');
const responsesCommon = require('../../common/response.common');
const md5 = require('md5');

/**
 * @description
 *
 *  This function is used to user login 
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function userLoginHandler(req, res) {
    const bodyData = req.body;
    if ("undefined" === typeof bodyData.emailId || bodyData.emailId == '' || bodyData.emailId == null) {
        return res.status(400).send(responsesCommon.formatErrorMessage('Please provide email!', 400, null));
    }
    if ("undefined" === typeof bodyData.loginType || bodyData.loginType == '' || bodyData.loginType == null) {
        return res.status(400).send(responsesCommon.formatErrorMessage('Please provide login type!', 400, null));
    }
    if (bodyData.loginType == "system" && ("undefined" === typeof bodyData.password || bodyData.password == '' || bodyData.password == null)) {
        return res.status(400).send(responsesCommon.formatErrorMessage('Please provide password!', 400, null));
    }
    await userServices.getUserLoginDetails(bodyData).then(async function (result) {
        if (result.code == 200) {
            const userRes = result.data;
            var sessiontoken = await userServices.saveSession(userRes);
            if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
                delete userRes.password;
                delete userRes.id;
                return res.status(200).send(responsesCommon.formatSuccessMessage(
                    'User logged in successfully',
                    userRes,
                    sessiontoken.userToken,
                    1,
                    ''
                ));
            } else {
                return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!...', 400, null));
            }
        } else {
            return res.status(400).send(responsesCommon.formatErrorMessage("Invalid Login credentials!!", 400, null));
        }
    }).catch(function (err) {
        return res.status(400).send(responsesCommon.formatErrorMessage(err, 400, null));
    });
}

module.exports = userLoginHandler;