const businessUserServices = require("../../services/businessuserservices");
const responsesCommon = require("../../common/response.common");
const md5 = require("md5");
const Permissions = require("../../models").permissions;
const { assignPermissionsIfNotExist, getPermissionsAndMenus , getPermissionsAndMenusForAdmin} = require("../../services/businessuserservices");

async function userLoginHandler(req, res) {
  const bodyData = req.body;
  const { emailId, loginType, password, userType } = bodyData;

  if (!emailId) {
    return res.status(400).send(responsesCommon.formatErrorMessage("Please provide email!", 400, null));
  }
  if (!loginType) {
    return res.status(400).send(responsesCommon.formatErrorMessage("Please provide login type!", 400, null));
  }
  if (loginType === "system" && !password) {
    return res.status(400).send(responsesCommon.formatErrorMessage("Please provide password!", 400, null));
  }

  try {
    const result = await businessUserServices.getLoginDetails(bodyData);

    if (result.code === 200) {
      const userRes = result.data;
      const sessiontoken = await businessUserServices.saveSession(userRes);

      if (sessiontoken) {
        delete userRes.password; 

        if (userType === "admin") {
          // const permissionResult = await assignPermissionsIfNotExist(userRes.id);
          const menus = await getPermissionsAndMenusForAdmin(userRes.id);
          userRes["menus"] = menus;
          return res.status(200).send(
            responsesCommon.formatSuccessMessage(
              "Admin logged in successfully",
              userRes,
              sessiontoken.userToken,
              1,
              ""
            )
          );
        } else {
          const permissionResult = await assignPermissionsIfNotExist(userRes.id);
          const menus = await getPermissionsAndMenus(userRes.id);
          userRes["menus"] = menus;

          return res.status(200).send(
            responsesCommon.formatSuccessMessage(
              "User logged in successfully",
              userRes,
              sessiontoken.userToken,
              1,
              ""
            )
          );
        }
      } else {
        return res.status(400).send(responsesCommon.formatErrorMessage("Error session token!", 400, null));
      }
    } else {
      return res.status(400).send(responsesCommon.formatErrorMessage(result.message, 400, null));
    }
  } catch (err) {
    return res.status(500).send(responsesCommon.formatErrorMessage(err.message || "Server error", 500, null));
  }
}

module.exports = userLoginHandler;
