const businessUserServices = require('../../services/businessuserservices');
const responsesCommon = require('../../common/response.common');
const Businessusers = require('../../models').businessusers;
const utilities = require("../../services/utilitiesservices");
const md5 = require('md5');

/**
 * @description
 *
 *  This function is used to verify otp
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function verifyEmail(req, res) {
    try {
        const bodyData = req.body;
        const query = { bus_email: bodyData.email };
        const user = await Businessusers.findOne({ where: query });
        if (!user) {
            return res.status(400).send("Invalid email! Please provide the correct email");
        }
        let otp = utilities.generateOTP();
        const otpEncrypted = md5(otp);
        user.email_verify_token = otpEncrypted;
        const savedUser = await user.save();
        const verificationLink = `${process.env.SITE_URL}/verify-email?token=${otpEncrypted}`;
        await utilities.sendEmailToNewUser(
            user.bus_email,
            user.first_name,
            "Email Verification",
            verificationLink
        );
        return res.status(200).send(responsesCommon.formatErrorMessage('Please check your email to verify!', 200, null));
    } catch (error) {
        console.log("error=====", error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error?.message, 400, null));
    }
}

module.exports = verifyEmail;