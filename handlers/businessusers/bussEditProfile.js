const responsesCommon = require('../../common/response.common');

const businessusers = require("../../models").businessusers;
/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function bussEditProfile(req, res) {
    try {
        const userId = req.body.uuid;
        delete req.body.uuid;
        if (!!userId) {
            const updatedUsers = await businessusers.update(req.body, {
                where: {
                    uuid: userId
                }
            })
            if (!!updatedUsers[0]) {
                return res.status(200).send(responsesCommon.apiformatSuccessMessage("User is updated successfully!", [], ""))
            } else {
                return res.status(400).send(responsesCommon.apiformatErrorMessage("Failed to update user!", [], ""))

            }

        }
        return res.status(400).send(responsesCommon.apiformatErrorMessage("Failed to update user!", [], ""))

    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.apiformatErrorMessage("Failed to update user!", [], ""))

    }
}

module.exports = bussEditProfile