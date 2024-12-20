
const responsesCommon = require('../../common/response.common');
const bocomments = require("../../models").bocomments;
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

async function createCommentHandler(req, res) {
    try{ 
        var app = require('../../app');
        const { io } = app;
        
        const {user_id, course_id, comment} = req.body

        const createComment = await bocomments.create({
            user_id:user_id,
            uuid:uuidv4(),
            course_id:course_id,
            comment:comment,
            likes:0,
            dislikes:0,
            status:"1"
        })

        if (!!createComment) {
            io.emit("updateUserComment", { newComment: createComment })
            // await axios.post(`${process.env.APP_NODE_URL}/api/user/createNotifications`, {
            //   user_id: to_user_id,
            //   title: `<strong>${to_user_name}</strong> is sent you message!`,
            //   org: "tecdemy",
            //   external_url_title: "Open disco room",
            //   external_url: `/disco-room`,
            //   category: "update"
            // })
            return res.status(200).send(responsesCommon.formatSuccessMessage('Comment Added Successfully', createComment, null, 0, null, 200));
          }
          return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong in createComment!", 400, null));


    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports= createCommentHandler
