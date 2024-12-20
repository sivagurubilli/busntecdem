const businessusers = require("../../models").businessusers;
const communityjoiner = require('../../models').community_joiner
const responsesCommon = require("../../common/response.common");

const joinCommunity = async (req, res) => {

    const { email, consent } = req.body
    console.log('[email]',email,'[consent]',consent)
    try {
        const [existingUser, isRegisteredUser] = await Promise.all([
            communityjoiner.findOne({ where: { email } }),
            businessusers.findOne({ where: { bus_email: email } }),
        ]);

        if (existingUser) {
            return res.status(409).send(
                responsesCommon.formatErrorMessage('You are already joined the community', 409, null)
            );
        }

        const type = isRegisteredUser ? 'registered_user' : 'guest';

        const newRegistration = await communityjoiner.create({ email, consent, type });

        if(newRegistration){
            return res.status(200).send(responsesCommon.formatSuccessMessage("Joined successfully",newRegistration, null, 0, null, 200))
        }


        return res.status(400).send(
            responsesCommon.formatErrorMessage('Something went wrong', 500, null)
        );

    } catch (error) {
        console.error("[Error in community_joiner]:", error);
        return res.status(400).send(
            responsesCommon.formatErrorMessage(error?.message, 400, null)
        );
    }
  
}

module.exports = joinCommunity