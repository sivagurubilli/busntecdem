const responsesCommon = require("../../common/response.common");
const bocomments = require("../../models").bocomments;
const businessusers = require("../../models").businessusers;
const boreply = require("../../models").boreply;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function getCommentHandler(req, res) {
  try {
    var app = require('../../app');
    const { io } = app;
    const { course_id, sortValue } = req.body;
    // Find all records from the DataModel

    let data = []

    if(sortValue==="Newest First"){
      data = await bocomments.findAll({
        where: {
          status: 1,
          course_id: course_id,
        },
        order: [["createdAt", "DESC"]],
      });
    }

    if(sortValue === "Top Comments"){
      data = await bocomments.findAll({
        where: {
          status: 1,
          course_id: course_id,
        },
        order: [["likes", "DESC"]],
      });
    }

    const userIds = data.map((items) => items?.user_id);
    const commentIds = data.map((item) => item?.uuid);

   
    const users = await businessusers.findAll({
      where: {
        id: userIds,
        is_active:"1"
      },
      attributes: ["id", "first_name", "last_name", "profile_url"],
    });

    const commentReplies = await boreply.findAll({
      where: {
        comment_id: commentIds,
        status: "1",
      },
      // order: [["createdAt", "DESC"]],
    });

    const replyUserIds = commentReplies.map((items) => items?.user_id);
    const replyUsers = await businessusers.findAll({
      where: {
        id: replyUserIds,
        is_active:"1"
      },
      attributes: ["id", "first_name", "last_name", "profile_url"],
    });

    const updateRepliesData = commentReplies.map((items) => {
      const _items = items?.dataValues;
      return {
        ..._items,
        userDetails:
          replyUsers.find((fItems) => fItems?.id == items?.user_id) || {},
      };
    });

    const updateData = data.map((items) => {
      const _items = items?.dataValues;
      return {
        ..._items,
        userDetails: users.find((fItems) => fItems?.id == items?.user_id) || {},
        replies: updateRepliesData.filter((fItems)=> fItems?.comment_id == items?.uuid) || [],
      };
    });

    if (!!updateData) {
      io.emit("updatedComments", { newComment: updateData })
      // await axios.post(`${process.env.APP_NODE_URL}/api/user/createNotifications`, {
      //   user_id: to_user_id,
      //   title: `<strong>${to_user_name}</strong> is sent you message!`,
      //   org: "tecdemy",
      //   external_url_title: "Open disco room",
      //   external_url: `/disco-room`,
      //   category: "update"
      // })
      return res.status(200).send(updateData);
    }
    return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong in createComment!", 400, null));
  } catch (error) {
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error, 400, null));
  }
}

module.exports = getCommentHandler;
