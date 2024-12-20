const Businessusers = require("../../models").businessusers;
const responsesCommon = require('../../common/response.common');
const boreply = require("../../models").boreply;
const { v4: uuidv4 } = require('uuid');

/**
 * @description
 *
 *  This function is used to create a reply with user details.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function createReplyHandler(req, res) {
    try {
        const { user_id, comment_id, reply_comment } = req.body;

        // Fetch user details
        const user = await Businessusers.findOne({
            where: {
                id: user_id // Assuming 'id' is the primary key for businessusers table
            }
        });

        if (!user) {
            return res.status(404).send(responsesCommon.formatErrorMessage('User not found', 404, null));
        }

        // Create the reply
        const createReply = await boreply.create({
            user_id: user_id,
            uuid: uuidv4(),
            comment_id: comment_id,
            reply_comment: reply_comment,
            likes: 0,
            dislikes: 0,
            status: "1",
        });

        // Format response to include user details
        const replyWithDetails = {
            ...createReply.toJSON(), // Convert to plain object if needed
            userDetails: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_url: user.profile_url
            }
        };

        return res.status(200).send(replyWithDetails);

    } catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = createReplyHandler;
