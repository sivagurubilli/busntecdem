const responsesCommon = require("../../common/response.common");
const businessusers = require("../../models").businessusers;
const md5 = require("md5");

/**
 * @description
 * This function verifies the OTP and updates the password.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function verifyOtpAndUpdatePassword(req, res) {
  try {
    const bodyData = req.body;

    if (!bodyData.email || !bodyData.otp || !bodyData.newPassword) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide email, OTP, and new password!",
            400,
            null
          )
        );
    }

    const user = await businessusers.findOne({
      where: { bus_email: bodyData.email },
    });

    if (user) {
      const now = Date.now();
      if (now > user.otp_expiry) {
        return res
          .status(400)
          .send(responsesCommon.formatErrorMessage("OTP expired", 400, null));
      }

      // const hashedOtp = md5(bodyData.otp);
      // console.log(bodyData.otp, user.otp);
      if (bodyData.otp == user.otp) {
        const hashedPassword = md5(bodyData.newPassword);

        await businessusers.update(
          { password: hashedPassword },
          { where: { bus_email: bodyData.email } }
        );

        return res
          .status(200)
          .send(
            responsesCommon.apiformatSuccessMessage(
              "Password updated successfully",
              {},
              null
            )
          );
      } else {
        return res
          .status(400)
          .send(responsesCommon.formatErrorMessage("Invalid OTP", 400, null));
      }
    } else {
      return res
        .status(400)
        .send(responsesCommon.formatErrorMessage("User not found", 400, null));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}

module.exports = verifyOtpAndUpdatePassword;
