const socialMediaLinks = require("../../models").social_media_links;
const businessusers = require("../../models").businessusers
const responsesCommon = require('../../common/response.common');
const { v4: uuidv4 } = require('uuid');


async function socialMedia(req, res) {
    try {
        const { user_id } = req.body;

        if (!!user_id) {
            const existUser = await socialMediaLinks.findAll({
                where: {
                    user_id: user_id
                }
            })
            if (existUser.length > 0) {
                const updatedLinks = await socialMediaLinks.update({
                    ...req.body,
                    user_id: user_id,
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                return res.status(200).send(responsesCommon.formatErrorMessage("Social link is updated!", 200, null));
            }
            const updatedData = { ...req.body, uuid: uuidv4() }
            const createdSocialLinks = await socialMediaLinks.create(updatedData);
            if (!!createdSocialLinks) {
                return res.status(200).send(responsesCommon.formatErrorMessage("Social link created successfully!", 200, null));
            }
            return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));

        }

    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));

    }

}
module.exports = socialMedia;
