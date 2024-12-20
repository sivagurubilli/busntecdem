const responsesCommon = require('../../common/response.common');
// return res.status(200).send('Experience Added Successfully');
// return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
const { userQuestions } = require('../../models');




module.exports = {
    saveUserQuestion: async (req, res) => {
        try {
            const { questionId } = req.body;
            if (!!questionId) {
                //update
                return;
            }
            //create
            const createdQuestion = await userQuestions.create(req.body);
            return res.status(200).send(responsesCommon.formatSuccessMessage("Question added successfully!", createdQuestion, null, null, null, 200));
        } catch (error) {
            console.error(error);
            return res.status(400).send(responsesCommon.formatErrorMessage(error?.message, 400, null));

        }
    },
    fetchUserQuestion: async (req, res) => {
        try {
            const { user_id, courseVideoId } = req.body;
            const questionList = await userQuestions.findAll({
                where: { status: true, user_id, course_video_id: courseVideoId },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            return res.status(200).send(responsesCommon.formatSuccessMessage("Questions fetched successfully!", questionList, null, null, null, 200));
        } catch (error) {
            console.error(error);
            return res.status(400).send(responsesCommon.formatErrorMessage(error?.message, 400, null));
        }
    }
}