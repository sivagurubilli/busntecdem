const Adminusers = require('../../models').adminusers;
const adminServices = require('../../services/adminservices');
const responsesCommon = require('../../common/response.common');

/**
 * @description
 *
 *  This function is used to login  
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function adminLoginHandler(req, res) {
    try {
        const userdata = req.body;
        if (!userdata.emailId || !userdata.password) {
            return res.status(400).send(responsesCommon.formatErrorMessage('Please provide email and password !...', 400, null));
        }
        await adminServices.getAdminDetails(userdata).then(async function (result) {
            if (result.code == 200) {
                const userRes = result.data;
                var sessiontoken = await adminServices.saveSession(userRes);
                if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
                    delete userRes.password;
                    delete userRes.id
                    return res.status(200).send(responsesCommon.formatSuccessMessage(
                        'Admin logged in successfully',
                        userRes,
                        sessiontoken.userToken,
                        1,
                        ''
                    ));

                } else {
                    return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!...', 400, null));
                }
            } else {
                return res.status(400).send(responsesCommon.formatErrorMessage(result.message, 400, null));
            }
        }).catch(function (err) {
            return res.status(400).send(responsesCommon.formatErrorMessage(err, 400, null));
        });

    } catch (error) {

    }
}

module.exports = adminLoginHandler;