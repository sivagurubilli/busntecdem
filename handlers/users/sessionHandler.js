const { sessionRequest, businessusers } = require('../../models')
const responsesCommon = require('../../common/response.common');
const { default: axios } = require('axios');

module.exports = {
    sendSessionRequest: async (req, res) => {
        try {
            const { uuid, mentor_id, student_name } = req.body;
            if (!!uuid) {
                delete req.body.uuid;
                const updated = await sessionRequest.update(req.body, { where: { uuid } })
                if (updated[0] > 0) {
                    return res.status(200).send(responsesCommon.formatSuccessMessage("Session request updated!", [], null, 0, null, 200));
                }
                return res.status(500).send(responsesCommon.formatErrorMessage("Failed to update session request!",
                    [], null, 0, null, 500));
            }
            //create request
            const response = await sessionRequest.create(req.body);
            if (!!response) {
                //send notification to user
                await axios.post(`${process.env.APP_NODE_URL}/api/user/createNotifications`, {
                    user_id: mentor_id,
                    title: `${student_name} wants a session with you.`,
                    org: "tecdemy",
                    external_url_title: "Go to session page",
                    external_url: `/disco-room`,
                    category: "message"
                })
                return res.status(200).send(responsesCommon.formatSuccessMessage("Session request created!", [response], null, 0, null, 200));
            }
            return res.status(500).send(responsesCommon.formatErrorMessage("Failed to create session request!",
                [], null, 0, null, 500));

        } catch (error) {
            console.error(error);
        }
    },

    getSessionRequest: async (req, res) => {
        try {
            const { userRole, mentor_id, student_id } = req.body;
            let whereClause = { status: "1" };
            if (!!mentor_id) {
                whereClause.mentor_id = mentor_id;
            } else if (!!student_id) {
                whereClause.mentor_id = student_id;
            }
            const foundSession = await sessionRequest.findAll(whereClause);
            if (!!foundSession) {
                const updatedFoundedSession = await Promise.all(
                    foundSession.map(async (items) => {
                        const dataValues = items.dataValues;
                        const userId = !!student_id ? items?.mentor_id : items?.student_id;
                        let userDetails = {};
                        const userTypeDetails = !!student_id ? "mentorDetails" : "studentDetails";

                        try {
                            const res = await businessusers.findOne({ where: { id: userId, is_active: '1' }, attributes: ['uuid', 'id', 'first_name', 'last_name', 'profile_url', 'bus_email'] });
                            userDetails = res;
                        } catch (error) {
                            console.error('Error fetching user details: ', error);
                        }
                        return { ...dataValues, [userTypeDetails]: userDetails };
                    })
                );
                if (!!updatedFoundedSession) {
                    return res.status(200).send(responsesCommon.formatSuccessMessage("Session fetched!", updatedFoundedSession, null, 0, null, 500));
                }
            }
            return res.status(500).send(responsesCommon.formatErrorMessage("Failed to fetch session request!", [], null, 0, null, 500));
        } catch (error) {
            console.error(error);
        }
    },

}