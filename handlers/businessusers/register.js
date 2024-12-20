const businessUserServices = require("../../services/businessuserservices");
const responsesCommon = require("../../common/response.common");
const { v4: uuidv4 } = require("uuid");
const utilities = require("../../services/utilitiesservices");
const { default: axios } = require("axios");
const Permissions = require("../../models").permissions;
const Menu = require("../../models").menu;
const {
  getPermissionsAndMenus,
  assignPermissionsIfNotExist,
} = require("../../services/businessuserservices");
/**
 * @description
 *
 *  This function is used to business user signup
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const { Sequelize } = require("sequelize"); 

async function userRegisterHandler(req, res) {
  try {
    const bodyData = req.body;
    bodyData["uuid"] = uuidv4();

    const createdUser = await businessUserServices.createNewUser(bodyData, res);

    if (createdUser.code === 200) {
      const userRes = JSON.parse(JSON.stringify(createdUser));
      delete userRes.data.password;

      const { data } = userRes;
      await axios.post(
        `${process.env.APP_NODE_URL}/api/user/createNotifications`,
        {
          user_id: data?.id,
          title: `Hi <strong>${data?.first_name || ""} ${
            data?.last_name || ""
          }</strong>, Welcome to <strong>Tecdemy</strong> - Your learning journey begins here!`,
          org: "tecdemy",
          category: "message",
        }
      );
      const permissionResult = await assignPermissionsIfNotExist(data.id);
      const menus = await getPermissionsAndMenus(data.id);
      userRes.data.menus = menus;
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            "User created successfully!",
            userRes.data,
            userRes.userToken,
            1,
            ""
          )
        );
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(createdUser.message, 400, null)
        );
    }
  } catch (error) {
    return res
      .status(400)
      .send(
        responsesCommon.formatErrorMessage("Error in Creating User!", 400, null)
      );
  }
}

module.exports = userRegisterHandler;
