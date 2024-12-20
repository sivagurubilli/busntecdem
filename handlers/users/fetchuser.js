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

async function fetchuser(req, res) {
  try {
    let bodyData = req.body;
    if (bodyData.fetch && bodyData.fetch == 'ALL') {
      let user = await Users.findAll({
        where: { is_active: 1 },
        include: 'UBR',
      });
      let userData = JSON.parse(JSON.stringify(user));
      return res
        .status(200)
        .send(responsesCommon.formatSuccessMessage('data', userData));
    } else if (bodyData.fetch && bodyData.fetch == 'business') {
      let user = await users_business_roles.findAll({
        where: { business_id: parseInt(bodyData.business_id) },
        include: [
          {
            model: businessusers,
            as: 'business',
            attributes: ['bus_email', 'first_name', 'last_name'],
            required: true,
          },
          {
            model: role,
            as: 'userrole',
            attributes: ['Role'],
            required: false,
          },
          {
            model: Users,
            as: 'UBR',
            attributes: ['first_name', 'last_name'],
            required: false,
          },
        ],
      });
      let userData = JSON.parse(JSON.stringify(user));
      return res
        .status(200)
        .send(responsesCommon.formatSuccessMessage('data', userData));
    } else if (bodyData.fetch && bodyData.fetch == 'businessusers') {
    } else {
      return res.status(200).send(
        responsesCommon.formatSuccessMessage('No data found', {
          repsonds: 'No data found',
        })
      );
    }
  } catch (error) {
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Error in fetch User!!', 400, null)
      );
  }
}

async function filterByRoleMessage(req, res) {
  try {
    const { role, pageSize = 1, logedInuserId } = req.body;
    const limit = 50;
    const offset = (pageSize - 1) * limit;
    console.log('req.body', req.body);
    const users = await businessusers.findAll({
      where: {
        roles: role,
        is_active: 1,
      },
      offset: offset,
      limit,
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

    console.log('userChatsManage', userChatsManage);

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

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          `Users with role fetched successfully`,
          sortedResponse
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
async function filterByRole(req, res) {
  try {
    const { role, pageSize = 1 } = req.body;
    const limit = 50;
    const offset = (pageSize - 1) * limit; // Calculate the offset

    let users = await businessusers.findAll({
      where: {
        roles: role,
        is_active: 1,
      },
      offset: offset,
      limit,
    });
    let userData = JSON.parse(JSON.stringify(users));
    // get user ids
    const foundedUserIds = users.map((items) => `${items?.id}`);
    //fetch data for purchased course
    const purchasedUserCourse = await purchasedCourseTable.findAll({
      where: {
        user_id: foundedUserIds,
        status: '1',
      },
    });
    const updateData = purchasedUserCourse.map((items) => items?.dataValues);
    //fetch user's certificate
    const userCertificates = await userCertificateTable.findAll({
      where: { user_id: foundedUserIds, status: '1' },
    });
    // fetch last chat
    const userChatsManage = await userChatManageTable.findAll({
      where: { sender_id: foundedUserIds, status: '1', is_read: '0' },
      attributes: [
        'message_id',
        [Sequelize.col('createdAt'), 'lastMessageCreateAt'],
        'sender_id',
      ],
    });
    const updateUserChat = userChatsManage.map((items) => {
      return items?.dataValues;
    });
    const updatedCertificate = userCertificates.map(
      (items) => items?.dataValues
    );
    const updateResponse = users.map((items) => {
      const userItems = items?.dataValues;
      const userAllChatManage = updateUserChat
        .slice()
        .reverse() // Create a reversed copy of the array
        .find((item) => item.sender_id == userItems.id) || {
        lastMessageCreateAt: 0,
      };
      if (role === 'student') {
        userItems['userPurchasedCourses'] = updateData.filter(
          (item) => item.user_id == userItems.id
        ).length;
        userItems['userCertificates'] = updatedCertificate.filter(
          (item) => item.user_id == userItems.id
        ).length;
      }
      return { ...userItems, ...userAllChatManage };
    });
    // const sortedArray = updateResponse.sort((a, b) => new Date(a?.lastMessageCreateAt) - new Date(b?.lastMessageCreateAt)).reverse();
    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          `Users with role  fetched successfully`,
          updateResponse
        )
      );
  } catch (error) {
    // Handle errors
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
module.exports = {
  fetchuser,
  filterByRole,
  filterByRoleMessage,
};
