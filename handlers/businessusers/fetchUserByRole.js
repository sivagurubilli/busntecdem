const Users = require('../../models').users;
const userServices = require('../../services/userservices');
const responsesCommon = require('../../common/response.common');
const { Sequelize } = require('../../models');
const users_business_roles = require('../../models/').users_business_roles;
const businessusers = require('../../models').businessusers;
const purchasedCourseTable = require('../../models').userPurchased;
const userCertificateTable = require('../../models').userCertificates;
const userChatManageTable = require('../../models').userChatManage;
const role = require('../../models').roles;
/**
 * @description
 *
 *  This function is used to fetch users
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function fetchUserByRole(req, res) {
  try {
    const { role, pageSize = 1, logedInuserId } = req.body;
    const limit = 50;
    const offset = (pageSize - 1) * limit;

    const users = await businessusers.findAll({
      where: {
        roles: role,
        is_active: 1,
      },
      // offset: offset,
      // limit,
    });

    if (!users || users.length === 0) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            `No users found for the given role`,
            []
          )
        );
    }

    const userData = JSON.parse(JSON.stringify(users));
    const foundedUserIds = users.map((items) => `${items?.id}`);

    const purchasedUserCourse = await purchasedCourseTable.findAll({
      where: {
        user_id: foundedUserIds,
        status: '1',
      },
    });

    const userCertificates = await userCertificateTable.findAll({
      where: { user_id: foundedUserIds, status: '1' },
    });

    const userChatsManage = await userChatManageTable.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            sender_id: foundedUserIds,
            receiver_id: logedInuserId, // Include chats where logged-in user is the receiver
          },
          {
            receiver_id: foundedUserIds,
            sender_id: logedInuserId, // Include chats where logged-in user is the sender
          },
        ],
        status: '1', // Ensure chats are active
      },
      attributes: [
        'sender_id',
        'receiver_id',
        [
          Sequelize.fn('MAX', Sequelize.col('createdAt')),
          'lastMessageCreateAt', // Fetch the most recent message
        ],
      ],
      group: ['sender_id', 'receiver_id'], // Group by sender and receiver for unique chats
    });

    const updateUserChat = userChatsManage.map((items) => items?.dataValues);
    const updateData = purchasedUserCourse.map((items) => items?.dataValues);
    const updatedCertificate = userCertificates.map(
      (items) => items?.dataValues
    );

    const updateResponse = users.map((user) => {
      const userItems = user?.dataValues;

      const userLastChat = updateUserChat
        .filter(
          (chat) =>
            chat?.sender_id == userItems.id || chat?.receiver_id == userItems.id
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessageCreateAt) - new Date(a.lastMessageCreateAt)
        )[0] || {
        lastMessageCreateAt: null,
      };

      if (role === 'student') {
        userItems['userPurchasedCourses'] = updateData.filter(
          (item) => item.user_id == userItems.id
        ).length;
        userItems['userCertificates'] = updatedCertificate.filter(
          (item) => item.user_id == userItems.id
        ).length;
      }

      return { ...userItems, ...userLastChat };
    });

    const sortedResponse = updateResponse.sort((a, b) => {
      const dateA = new Date(a.lastMessageCreateAt || 0);
      const dateB = new Date(b.lastMessageCreateAt || 0);
      return dateB - dateA;
    });
    const top50Users = sortedResponse.slice(0, 50);

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          `Users with role fetched successfully`,
          top50Users
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Error in fetching users by role',
          400,
          null
        )
      );
  }
}

module.exports = fetchUserByRole;
