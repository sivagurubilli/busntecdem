const Users = require("../../models").users;
const userServices = require("../../services/userservices");
const responsesCommon = require("../../common/response.common");

/**
 * @description
 *
 *  This function is used to student signup
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function signUpHandler(req, res) {
  try {
    const bodyData = req.body;
    if (
      "undefined" === typeof bodyData.emailId ||
      bodyData.emailId == "" ||
      bodyData.emailId == null
    ) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide email!...",
            400,
            null
          )
        );
    }
    if (
      "undefined" === typeof bodyData.loginType ||
      bodyData.loginType == "" ||
      bodyData.loginType == null
    ) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide login type!...",
            400,
            null
          )
        );
    }
    const createdUser = await userServices.createNewUser(bodyData, res);
    if (createdUser.code == 200) {
      const userRes = JSON.parse(JSON.stringify(createdUser));
      delete userRes.data.password;
      return res.status(200).send(
        responsesCommon.formatSuccessMessage(
          // 'User created successfully!!',
          userRes.message,
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
        responsesCommon.formatErrorMessage(
          "Error in Creating User!!",
          400,
          null
        )
      );
  }
}

module.exports = signUpHandler;
