const recycleBin = require('../../models').recycleBin;
const courseUploads = require('../../models').courseUploads;
const couresReviews = require('../../models').couresReviews;
const reviewManage = require('../../models').reviewManage;
const userCourseProgress = require('../../models').userCourseProgress;
const cartTable = require('../../models').userCart;
const wishlistTable = require('../../models').userWishlist;
const userPurchased = require('../../models').userPurchased;
const bocomments = require('../../models').bocomments;
const bousernotes = require('../../models').bousernotes;
const toDoTable = require('../../models').toDoList;
const userCouponTable = require('../../models').userCoupon;
const userTable = require('../../models').businessusers;
const notificationTable = require('../../models').userNotifications;
const notificationTableMap = require('../../models').userNotificationMap;
const historyTable = require('../../models').saveHistory;
const userCertificateTable = require('../../models').userCertificates;
const courseContentTable = require('../../models').CourseContent;
const userChatTable = require('../../models').userChat;
const userChatManageTable = require('../../models').userChatManage;
const users = require('../../models').businessusers;
const md5 = require('md5');
const fs = require('fs');

const responsesCommon = require('../../common/response.common');
const { v4: uuidv4 } = require('uuid');
const { default: axios } = require('axios');
const { Op, Sequelize, where } = require('sequelize');
const moment = require('moment');
const messageService = require('../../messageService');
// const { getUserSocketId } = require('../../app');
async function updateProgressOfUser(req, res) {
  try {
  } catch (error) {
    console.error(error);
  }
}

async function handleAddToTrash(req, res) {
  try {
    req.body['uuid'] = uuidv4();
    const createdBin = recycleBin.create(req.body);
    if (!!createdBin) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('Added to trash!', 400, null)
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Failed to add in trash!', 400, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function getTrashData(req, res) {
  try {
    const { user_id } = req.body;
    if (!!user_id) {
      const fetchedBinData = await recycleBin.findAll({
        where: {
          user_id: user_id,
          status: '1',
        },
      });
      const transformedData = fetchedBinData.reduce((acc, current) => {
        const { recycle_key, recycle_data } = current;
        if (!acc[recycle_key]) {
          acc[recycle_key] = [];
        }
        acc[recycle_key].push(current);
        return acc;
      }, {});
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Trash data fetched successfully!',
            transformedData,
            200
          )
        );
    }
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function updateTrashData(req, res) {
  try {
    const { uuid } = req.body;
    if (!!uuid) {
      const _uuid = uuid?.split('~');
      const updatedBinData = await recycleBin.update(req.body, {
        where: {
          uuid: _uuid,
        },
      });
      if (updatedBinData) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Data removed from bin!',
              [],
              200
            )
          );
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function restoreData(req, res) {
  try {
    const { recycle_key, row_uuid, recycle_data, uuid } = req?.body;
    if (recycle_key === 'resourceLinks') {
      const findData = await courseUploads.findOne({
        where: { uuid: row_uuid, status: '1' },
      });
      let newData = '';
      if (!!findData['resources_list']) {
        newData = `${findData['resources_list']}|${recycle_data}`;
      } else {
        newData = recycle_data;
      }
      findData['resources_list'] = newData;
      const updateData = await courseUploads.update(findData['dataValues'], {
        where: { uuid: row_uuid },
      });
      if (updateData[0] > 0) {
        const update = await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Resource link has been restored!',
              [],
              200
            )
          );
      }
    }
    if (recycle_key === 'resourceFiles') {
      const findData = await courseUploads.findOne({
        where: { uuid: row_uuid, status: '1' },
      });
      let newData = '';
      if (!!findData['external_resources']) {
        newData = `${findData['external_resources']}|${recycle_data}`;
      } else {
        newData = recycle_data;
      }
      findData['external_resources'] = newData;
      const updateData = await courseUploads.update(findData['dataValues'], {
        where: { uuid: row_uuid },
      });
      if (updateData[0] > 0) {
        const update = await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: uuid,
            },
          }
        );
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Resource file has been restored!',
              [],
              200
            )
          );
      }
    }
    if (recycle_key === 'reviewList') {
      const updateData = await couresReviews.update(
        { status: '1' },
        {
          where: { uuid: row_uuid },
        }
      );
      const _updateData = await reviewManage.update(
        { status: '1' },
        {
          where: {
            course_id: req?.body?.course_id,
            user_id: req?.body?.user_id,
          },
        }
      );
      if (updateData[0] > 0) {
        const update = await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: uuid,
            },
          }
        );
      }
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Review has been restored!',
            [],
            200
          )
        );
    }
    if (recycle_key === 'comments') {
      const updateData = await bocomments.update(
        { status: '1' },
        {
          where: { uuid: row_uuid },
        }
      );
      const _updateData = await reviewManage.update(
        { status: '1' },
        {
          where: {
            course_id: req?.body?.course_id,
            user_id: req?.body?.user_id,
          },
        }
      );
      if (updateData[0] > 0) {
        const update = await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: uuid,
            },
          }
        );
      }
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Comment has been restored!',
            [],
            200
          )
        );
    }
    if (recycle_key === 'notes') {
      const updateData = await bousernotes.update(
        { status: '1' },
        {
          where: { uuid: row_uuid },
        }
      );
      const _updateData = await reviewManage.update(
        { status: '1' },
        {
          where: {
            course_id: req?.body?.course_id,
            user_id: req?.body?.user_id,
          },
        }
      );
      if (updateData[0] > 0) {
        const update = await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: uuid,
            },
          }
        );
      }
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Notes has been restored!',
            [],
            200
          )
        );
    }

    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Something went wrong!', 400, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function deleteDataFromBinAuto() {
  try {
    //fetch all data from recycle bin data ====>
    const recycleBinData = await recycleBin.findAll();
    //every data should delete after 48 hours from it created time
    //if data is not deleted then it will be deleted after 48 hours from it created
    //time
    recycleBinData.forEach(async (element) => {
      const time = element.createdAt;
      const timeInMs = time.getTime();
      const timeInMsPlus = timeInMs + 172800000;
      const currentTime = new Date();
      const currentTimeInMs = currentTime.getTime();
      if (currentTimeInMs > timeInMsPlus) {
        await recycleBin.update(
          { status: '0' },
          {
            where: {
              uuid: element.uuid,
              status: '1',
            },
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function saveUserProgress(req, res) {
  try {
    const { user_id, upload_id, course_id, video_progress, is_completed } =
      req?.body;
    const foundProgress = await userCourseProgress.findOne({
      where: { user_id, upload_id },
    });
    if (!!foundProgress) {
      const { upload_id, user_id, course_id } = foundProgress;
      const updateProgress = await userCourseProgress.update(
        { video_progress, is_completed },
        { where: { user_id, upload_id, course_id } }
      );
      if (updateProgress[0] > 0) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'User progress saved!',
              [],
              200
            )
          );
      }
    } else {
      req.body['uuid'] = uuidv4();
      const createProgress = await userCourseProgress.create(req?.body);
      if (!!createProgress) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'User progress saved!',
              [],
              200
            )
          );
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function addToCartV1(req, res) {
  try {
    const { user_id, course_id } = req?.body;
    const foundCart = await cartTable.findOne({
      where: { user_id, course_id, status: '1' },
    });
    if (!!foundCart) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Course already added to cart!',
            200,
            null
          )
        );
    }
    req.body['uuid'] = uuidv4();
    const createCart = await cartTable.create(req?.body);
    if (!!createCart) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Course added to cart!',
            200,
            null
          )
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function getCartItems_v1(req, res) {
  try {
    const { user_id } = req?.body;
    const foundCart = await cartTable.findAll({
      where: { user_id, status: '1' },
    });
    if (!!foundCart) {
      const cartIds = foundCart.map((items) => items?.course_id);
      axios
        .post(`${process.env.APP_NODE_URL}/api/business/fetchCoursesList`, {
          id: cartIds.join('|'),
          external: '1',
        })
        .then((apiRes) => {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                apiRes?.status?.message,
                200,
                apiRes?.data
              )
            );
        });
    } else {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('No items in cart!', 200, null)
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
}

async function addToWishlist_v1(req, res) {
  try {
    const { user_id, course_id } = req?.body;
    const foundCart = await wishlistTable.findOne({
      where: { user_id, course_id, status: '1' },
    });
    if (!!foundCart) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Course already added to wishlist!',
            200,
            null
          )
        );
    }
    req.body['uuid'] = uuidv4();
    const createWishlist = await wishlistTable.create(req?.body);
    if (!!createWishlist) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Course added to wishlist!',
            200,
            null
          )
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function getCartItems_v1(req, res) {
  try {
    const { user_id } = req?.body;
    const foundCart = await cartTable.findAll({
      where: { user_id, status: '1' },
    });
    if (!!foundCart) {
      const cartIds = foundCart.map((items) => items?.course_id);
      axios
        .post(`${process.env.APP_NODE_URL}/api/business/fetchCoursesList`, {
          id: cartIds.join('|'),
          external: '1',
        })
        .then((apiRes) => {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                apiRes?.status?.message,
                200,
                apiRes?.data
              )
            );
        });
    } else {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('No items in cart!', 200, null)
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
}

async function getWishList_v1(req, res) {
  try {
    const { user_id } = req?.body;
    const foundCart = await wishlistTable.findAll({
      where: { user_id, status: '1' },
    });
    if (!!foundCart) {
      const cartIds = foundCart.map((items) => items?.course_id);
      axios
        .post(`${process.env.APP_NODE_URL}/api/business/fetchCoursesList`, {
          id: cartIds.join('|'),
          external: '1',
        })
        .then((apiRes) => {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                apiRes?.status?.message,
                200,
                apiRes?.data
              )
            );
        });
    } else {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('No items in cart!', 200, null)
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
}

async function addPurchasedByUser(req, res) {
  try {
    const { user_id, course_title = '', course_uuid = '' } = req.body;
    delete req.body.course_uuid;
    req.body['uuid'] = uuidv4();
    const createdPurchased = await userPurchased.create(req.body);
    if (!!createdPurchased) {
      await axios.post(
        `${process.env.APP_NODE_URL}/api/user/createNotifications`,
        {
          user_id: user_id,
          title: `Congratulations on enrolling in ${course_title}! We're excited to have you on board.`,
          org: 'tecdemy',
          external_url_title: 'Open course',
          external_url: `/coursevideo/${course_uuid}`,
          category: 'update',
        }
      );
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Purchased course added!',
            200,
            null
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Something went wrong!', 400, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function getPurchasedByUser(req, res) {
  try {
    const { user_id } = req?.body;
    const foundCart = await userPurchased.findAll({
      where: { user_id, status: '1' },
    });
    if (!!foundCart) {
      const cartIds = foundCart.map((items) => items?.course_id);
      axios
        .post(`${process.env.APP_NODE_URL}/api/business/fetchCoursesList`, {
          id: cartIds.join('|'),
          external: '1',
          user_id: user_id,
        })
        .then((apiRes) => {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                apiRes?.status?.message,
                apiRes?.data,
                null,
                0,
                null,
                200
              )
            );
        })
        .catch((error) => {
          return res
            .status(400)
            .send(
              responsesCommon.formatErrorMessage(error?.message, 400, null)
            );
        });
    } else {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage('No items in cart!', 200, null)
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
}
async function removeFromWishlist_v1(req, res) {
  try {
    const { user_id, course_id } = req?.body;
    const foundWishlist = await wishlistTable.findOne({
      where: { user_id, course_id, status: '1' },
    });
    if (!foundWishlist) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'Course not found in wishlist!',
            400,
            null
          )
        );
    }
    await wishlistTable.update(
      { status: '0' },
      { where: { user_id, course_id } }
    );
    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'Course removed from wishlist!',
          200,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

async function removeFromCart_v1(req, res) {
  try {
    const { user_id, course_id } = req?.body;
    const foundCart = await cartTable.findOne({
      where: { user_id, course_id, status: '1' },
    });
    if (!foundCart) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'Course not found in cart!',
            400,
            null
          )
        );
    }
    await cartTable.update({ status: '0' }, { where: { user_id, course_id } });
    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          'Course removed from cart!',
          200,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
}

//using for update also
const addToDoList = async (req, res) => {
  try {
    const { uuid } = req.body;
    if (!!uuid) {
      //update todo
      const todo = await toDoTable.update(req.body, { where: { uuid } });
      if (todo[0] > 0) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Updated successfully!',
              [],
              null,
              0,
              null,
              200
            )
          );
      }
    }
    //create
    req.body['uuid'] = uuidv4();
    const createdTodo = await toDoTable.create(req.body);
    if (createdTodo) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Added successfully!',
            [],
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Something went wrong!', 400, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
};

const getToDoList = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!!user_id) {
      const fetchedTdoList = await toDoTable.findAll({
        where: {
          user_id,
          status: '1',
        },
        attributes: [
          'uuid',
          'to_do_text',
          'createdAt',
          'is_checked',
          'status',
          'user_id',
        ],
        order: [['id', 'DESC']],
      });
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Fetched successfully!',
            fetchedTdoList,
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('user_id is required!', 400, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
};

const addUpdateCoupon = async (req, res) => {
  try {
    const { uuid } = req.body;
    if (uuid) {
      //update
      const updatedCoupon = await userCouponTable.update(req.body, {
        where: {
          uuid: uuid,
        },
      });
      if (updatedCoupon[0] > 0) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Updated successfully!',
              null,
              null,
              0,
              null,
              200
            )
          );
      } else {
        return res
          .status(400)
          .send(
            responsesCommon.formatErrorMessage('Coupon not found!', 400, null)
          );
      }
    }
    //create
    req.body['uuid'] = uuidv4();
    const createdCoupon = await userCouponTable.create(req.body);
    if (createdCoupon) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Created successfully!',
            null,
            null,
            0,
            null,
            200
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('Coupon not created!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const applyCoupon = async (req, res) => {
  try {
    const findCoupon = await userCouponTable.findOne({
      where: { ...req.body, status: '1' },
      attributes: ['coupon', 'discount_amount'],
    });
    if (!!findCoupon) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Coupon applied successfully!',
            findCoupon,
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage('Coupon not found!', 400, null));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error.message, 400, null));
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password, user_id } = req.body;
    const findUser = await userTable.findOne({
      where: {
        id: user_id,
        password: current_password,
      },
    });
    if (!!findUser) {
      const updatedPassword = await userTable.update(
        {
          password: new_password,
        },
        {
          where: {
            id: user_id,
          },
        }
      );
      if (updatedPassword[0] > 0) {
        await axios.post(
          `${process.env.APP_NODE_URL}/api/user/createNotifications`,
          {
            user_id: user_id,
            title: `Your password has been updated!`,
            org: 'tecdemy',
            external_url_title: '',
            external_url: ``,
            category: 'update',
          }
        );
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Password changed successfully!',
              null,
              null,
              0,
              null,
              200
            )
          );
      } else {
        return res
          .status(400)
          .send(
            responsesCommon.formatErrorMessage(
              'Password not updated!',
              400,
              null
            )
          );
      }
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'Current password is wrong!',
            400,
            null
          )
        );
    }
    // const
    // return res.json({})
  } catch (error) {
    console.error(error);
  }
};

const createNotifications = async (req, res) => {
  try {
    var app = require('../../app');
    const { io, getUserSocketId } = app;
    req.body['uuid'] = uuidv4();

    const createNotifications = await notificationTable.create(req.body);
    if (!!createNotifications) {
      createNotifications.dataValues.notificationStatus = { is_read: '0' };
      //sending notification to client

      io.emit('updateNotifications', {
        newNotification: createNotifications,
      });

      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Notification created successfully!',
            null,
            null,
            0,
            null,
            200
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            'Notification not created!',
            400,
            null
          )
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const getNotifications = async (req, res) => {
  try {
    const { user_id } = req?.body;
    if (!!user_id) {
      const notifications = await notificationTable.findAll({
        where: {
          [Op.or]: [{ user_id: user_id }, { user_id: '' }],
        },
        status: '1',
        order: [['id', 'DESC']],
      });
      const notificationIds = notifications.map((items) => items?.id);
      const notificationMapping = await notificationTableMap.findAll({
        where: { notification_id: notificationIds },
      });

      //updating notification status
      const updatedNotificationStatus = notifications.map((items) => {
        const notification = items?.dataValues;
        return {
          ...notification,
          notificationStatus:
            notificationMapping.find(
              (items) => notification?.id == items?.notification_id
            ) || {},
        };
      });

      if (!!updatedNotificationStatus) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Notifications fetched successfully!',
              updatedNotificationStatus,
              null,
              0,
              null,
              200
            )
          );
      } else {
        return res
          .status(400)
          .send(
            responsesCommon.formatErrorMessage(
              'Notifications not fetched!',
              400,
              null
            )
          );
      }
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('User id is required!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const markAsReadNotification = async (req, res) => {
  try {
    const { is_read, notification_id, user_id, uuid } = req.body;
    const foundedNotifications = await notificationTableMap.findOne({
      where: {
        notification_id: notification_id,
      },
    });
    if (!!foundedNotifications) {
      const updatedNotification = await notificationTableMap.update(
        { is_read: is_read },
        {
          where: { notification_id: notification_id, user_id },
        }
      );
      if (updatedNotification[0] >= 1) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'update',
              null,
              null,
              0,
              null,
              200
            )
          );
      }
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('Missing parameters!', 400, null)
        );
    } else {
      if (!!notification_id && !!user_id) {
        req.body['uuid'] = uuidv4();
        req.body['is_read'] = '1';
        const createdNotificationMap = await notificationTableMap.create(
          req.body
        );
        if (createdNotificationMap) {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                'create',
                createdNotificationMap,
                null,
                0,
                null,
                200
              )
            );
        }
      }
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('Missing parameters!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const saveHistory = async (req, res) => {
  try {
    const { user_id, history_text } = req?.body;
    req.body['uuid'] = uuidv4();
    const createdHistory = await historyTable.create(req.body);
    if (createdHistory) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'History saved successfully!',
            null,
            null,
            0,
            null,
            200
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('History not saved!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const getHistory = async (req, res) => {
  try {
    const { user_id } = req.body;
    const history = await historyTable.findAll({
      where: {
        user_id: user_id,
      },
      order: [['id', 'desc']],
      attributes: [
        [
          Sequelize.fn('DISTINCT', Sequelize.col('history_text')),
          'history_text',
        ],
      ],
    });
    if (history) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'History fetched successfully!',
            history,
            null,
            0,
            null,
            200
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('History not fetched!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const createCertificate = async (req, res) => {
  try {
    let { body } = req;
    let { type, user_id } = req.body;

    if (type === 'certificate') {
      body['uuid'] = uuidv4();
      const createdCertificate = await userCertificateTable.create(body);
      if (createdCertificate) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Certificate created successfully!',
              createdCertificate,
              null,
              0,
              null,
              200
            )
          );
      } else {
        return res
          .status(400)
          .send(
            responsesCommon.formatErrorMessage(
              'Failed to create certificate!',
              400,
              null
            )
          );
      }
    } else if (type === 'welcome') {
      const foundWelcome = await userCertificateTable.findOne({
        where: { user_id, type: 'welcome' },
      });

      if (foundWelcome) {
        return res
          .status(200)
          .send(
            responsesCommon.formatSuccessMessage(
              'Certificate created successfully!',
              [],
              null,
              0,
              null,
              200
            )
          );
      } else {
        body['uuid'] = uuidv4();
        const createdWelcome = await userCertificateTable.create(body);
        if (createdWelcome) {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                'Welcome message created successfully!',
                createdWelcome,
                null,
                0,
                null,
                200
              )
            );
        } else {
          return res
            .status(400)
            .send(
              responsesCommon.formatErrorMessage(
                'Failed to create welcome message!',
                400,
                null
              )
            );
        }
      }
    } else {
      return res
        .status(400)
        .send(responsesCommon.formatErrorMessage('Invalid type!', 400, null));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage(
          'An error occurred while processing your request.',
          500,
          error
        )
      );
  }
};

const getCertificate = async (req, res) => {
  try {
    const { course_id, user_id, type } = req.body;
    let query = {};
    if (user_id) query = { [Op.or]: [{ user_id: user_id }, { user_id: '' }] };
    if (course_id) query.course_id = course_id;
    if (type) query.type = type;

    const foundCertificate = await userCertificateTable.findOne({
      where: query,
      order: [['id', 'desc']],
    });

    if (!!foundCertificate) {
      const dataValues = foundCertificate?.dataValues;
      dataValues['createdDate'] = moment(dataValues?.createdAt).format(
        'DD-MM-YYYY'
      );
      dataValues['certificateNumber'] = `TECDEMY-${dataValues?.uuid}`;
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Certificate fetched successfully!',
            dataValues,
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage('Certificate not found!', 400, null)
      );
  } catch (error) {
    console.error(error);
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const { user_id } = req.body;
    const foundCertificate = await userCertificateTable.findAll({
      where: {
        [Op.or]: [{ user_id: user_id }, { user_id: '' }],
        status: '1',
      },
    });

    if (!!foundCertificate) {
      const courseIds = foundCertificate.map((items) => items?.course_id);
      const courseData = await axios.post(
        `${process.env.APP_NODE_URL}/api/business/fetchCoursesList`,
        {
          id: courseIds.join('|'),
          external: '1',
          user_id: user_id,
        }
      );
      const certificates = foundCertificate.map(async (certificate) => {
        const dataValues = certificate?.dataValues;
        dataValues['courseDetails'] = courseData?.data?.data?.find(
          (items) => items?.id == dataValues?.course_id
        );
        dataValues['createdDate'] = moment(dataValues?.createdAt).format(
          'DD-MM-YYYY'
        );
        dataValues['certificateNumber'] = `TECDEMY-${dataValues?.uuid}`;
        return dataValues;
      });
      // Resolve all promises in the certificates array
      Promise.all(certificates)
        .then((resolvedCertificates) => {
          return res
            .status(200)
            .send(
              responsesCommon.formatSuccessMessage(
                'Certificates fetched successfully!',
                resolvedCertificates,
                null,
                0,
                null,
                200
              )
            );
        })
        .catch((error) => {
          return res
            .status(400)
            .send(
              responsesCommon.formatErrorMessage(error?.message, 400, null)
            );
        });
    }
  } catch (error) {
    console.error(error);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!!user_id) {
      const fetchedNotifications = await notificationTable.findAll({
        where: {
          [Op.or]: [{ user_id: user_id }, { user_id: '' }],
          status: '1',
        },
      });
      //find from notification table
      const notificationIds = fetchedNotifications.map((items) => items?.id);
      const fetchedNotificationMap = await notificationTableMap.findAll({
        where: {
          notification_id: notificationIds,
          user_id: user_id,
          status: '1',
        },
      });
      //unread notifications which is saved in map table & update as read
      let mappedNotificationId = fetchedNotificationMap.map((items) => {
        return Number(items?.notification_id);
      });
      if (mappedNotificationId.length > 0) {
        // marking as read 1 which are saved in mapping table
        await notificationTableMap.update(
          { is_read: '1' },
          {
            where: {
              notification_id: mappedNotificationId,
            },
          }
        );
      }

      //fetch notifications which are not save map table & create rows for it
      const notMappedNotification = fetchedNotifications.filter(
        (items) => !mappedNotificationId.includes(items.id)
      );
      const updatedNotifications = notMappedNotification.map(
        (items) => items?.id
      );
      updatedNotifications.map(async (notifyId) => {
        await notificationTableMap.create({
          notification_id: notifyId,
          user_id,
          is_read: '1',
          uuid: uuidv4(),
        });
      });
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'All notifications read successfully !',
            [],
            null,
            0,
            null,
            200
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage('user_id is missing!', 400, null)
        );
    }
  } catch (error) {
    console.error(error);
  }
};

const createChat = async (req, res) => {
  try {
    var app = require('../../app');
    const { io, getUserSocketId } = app;
    const { to_user_id, to_user_name, from_user_id, message_text } = req.body;

    // Create chat and fetch user details in parallel
    const [createdChat, userDetails] = await Promise.all([
      userChatTable.create(req.body),
      userTable.findOne({ where: { id: to_user_id } }),
    ]);

    if (createdChat) {
      // Create chat manage entry
      const chatManagePromise = userChatManageTable.create({
        receiver_id: to_user_id,
        sender_id: from_user_id,
        message_id: createdChat.id,
      });

      if (createdChat.is_group_chat === '1') {
        const groupUserDetails = await userTable.findOne({
          where: { id: createdChat.from_user_id, is_active: 1 },
          attributes: [
            'id',
            'first_name',
            'last_name',
            'bus_email',
            'profile_url',
            'roles',
          ],
        });
        if (groupUserDetails) {
          createdChat.dataValues.userDetails = groupUserDetails.dataValues;
        }
        io.emit('updateGroupChat', { newChat: createdChat });
      } else {
        // Emit to recipient's socket
        const recipientSocketId = getUserSocketId(to_user_id);
        io.to(recipientSocketId).emit('updateMessageCount', {
          userId: from_user_id,
          messageCountIncrement: 1,
        });
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('updateUserChat', {
            newChat: createdChat,
            lastMessageCreateAt: createdChat.createdAt,
          });
        }

        // Queue notification creation
        const notificationPromise = axios.post(
          `${process.env.APP_NODE_URL}/api/user/createNotifications`,
          {
            user_id: to_user_id,
            title: `${userDetails.first_name} ${userDetails.last_name} sent you a message: ${message_text}`,
            org: 'tecdemy',
            external_url_title: '',
            external_url: ``,
            category: 'message',
          }
        );

        await Promise.all([chatManagePromise, notificationPromise]);
      }

      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Chat created successfully!',
            createdChat,
            null,
            0,
            null,
            200
          )
        );
    }

    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Something went wrong in createChat!',
          400,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
};

const getUserChat = async (req, res) => {
  try {
    const { user_id, selectMentorId } = req.body;
    let where = {
      status: '1',
      is_group_chat: '0',
      [Op.or]: [
        { from_user_id: user_id, to_user_id: selectMentorId },
        { from_user_id: selectMentorId, to_user_id: user_id },
      ],
    };

    if (selectMentorId === 'all') {
      where = { is_group_chat: '1', status: '1' };
    }

    let findByMentor = await userChatTable.findAll({ where });
    const fromUserIds = findByMentor?.map((items) => items?.from_user_id);
    const foundUsers = await userTable.findAll({
      where: { id: fromUserIds, is_active: 1 },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'bus_email',
        'profile_url',
        'roles',
      ],
    });

    const updatedUsers = findByMentor.map((items) => {
      const _items = items.dataValues;
      return {
        ..._items,
        userDetails: foundUsers.find(
          (item) => item?.id == _items?.from_user_id
        ),
      };
    });

    if (!!updatedUsers) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Chat fetched successfully!',
            updatedUsers,
            null,
            0,
            null,
            200
          )
        );
    }

    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage('No chats found!', 400, null));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
};

const searchUsers = async (req, res) => {
  try {
    const { search_text, role, pageSize = 1 } = req.body;
    const limit = 50;
    const offset = (pageSize - 1) * limit; // Calculate the offset
    const foundUsersList = await userTable.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search_text}%` } },
          { last_name: { [Op.like]: `%${search_text}%` } },
          // { bus_email: { [Op.like]: `%${search_text}%` } },
        ],
        roles: role,
      },
      offset: offset,
      limit,
      // order  : [['id', 'desc']]
    });
    const userIds = foundUsersList.map((items) => items?.id);
    // const fetchedChatManage = await userChatManageTable.findAll({
    //   where: { from_user_id: userIds },
    // })
    if (!!foundUsersList) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Users fetched successfully!',
            foundUsersList,
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Something went wrong in searchUsers!',
          400,
          null
        )
      );
  } catch (error) {}
};

const fetchChatStatus = async (req, res) => {
  try {
    const { user_id } = req.body;
    const foundChatStatus = await userChatManageTable.findAll({
      where: { receiver_id: user_id, status: '1', is_read: '0' },
    });
    if (!!foundChatStatus) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Chat status fetched successfully!',
            foundChatStatus,
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Something went wrong in fetchChatStatus!',
          400,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
};

const markAsReadMessage = async (req, res) => {
  try {
    const { user_id, selectedUserId, is_read } = req.body;

    const updatedChat = await userChatManageTable.update(
      { is_read },
      {
        where: {
          receiver_id: user_id,
          sender_id: selectedUserId,
        },
      }
    );
    if (updatedChat[0] >= 0) {
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Chat status updated successfully!',
            [],
            null,
            0,
            null,
            200
          )
        );
    }
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage(
          'Something went wrong in markAsReadMessage!',
          400,
          null
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
  }
};

const addToIFlow = (req, res) => {
  try {
    const { user_id, data } = req.body;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  markAsReadMessage,
  fetchChatStatus,
  searchUsers,
  updateProgressOfUser,
  handleAddToTrash,
  getTrashData,
  updateTrashData,
  restoreData,
  deleteDataFromBinAuto,
  saveUserProgress,
  addToCartV1,
  addToWishlist_v1,
  getCartItems_v1,
  getWishList_v1,
  addPurchasedByUser,
  getPurchasedByUser,
  removeFromWishlist_v1,
  removeFromCart_v1,
  addToDoList,
  getToDoList,
  addUpdateCoupon,
  applyCoupon,
  changePassword,
  createNotifications,
  getNotifications,
  markAsReadNotification,
  saveHistory,
  getHistory,
  createCertificate,
  getCertificate,
  getAllCertificates,
  markAllAsRead,
  createChat,
  getUserChat,
  addToIFlow,
};
