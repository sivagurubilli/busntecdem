const md5 = require("md5");
const Businessusers = require("../../models").businessusers;
const responsesCommon = require("../../common/response.common");
const { saveSession } = require("../../services/businessuserservices");
const social_media_links = require("../../models").social_media_links;
const { v4: uuidv4 } = require("uuid");


async function boLoginHandler(req, res) {
    try {
        const { bus_email } = req.body;
        const password = md5(req.body.password);
        let query = {
            bus_email,
            password
        }
        const response = await Businessusers.findOne({ where: { ...query, is_active: 1 } })
        if (!!response) {
            const _response = response.dataValues;
            delete _response?.password
            const socialMediaData = await social_media_links.findOne({
                where: {
                    user_id: _response?.id,
                    status: 1,
                },
            });
            delete socialMediaData?.id;
            const sessionToken = await saveSession(_response, "business");
            if (!!sessionToken) {
                if (!!socialMediaData) {
                    _response["socialMediaLinks"] = socialMediaData || {};
                }
                return res.status(200).send(responsesCommon.formatSuccessMessage("Login successfully", _response, sessionToken?.userToken, 0, null, 200));
            }
            return res.status(200).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));

        }
        return res.status(200).send(responsesCommon.formatErrorMessage("Invalid login credentials", 400, null));
    } catch (error) {
        console.error(error);
    }
}

async function boRegisterHandler(req, res) {
    try {
        const { password } = req.body;
        const _password = md5(password);
        req.body['password'] = _password;
        req.body['is_active'] = 0;
        req.body['email_verified'] = 0;
        req.body['login_type'] = "system";
        req.body['roles'] = "student";
        req.body['uuid'] = uuidv4();
        const existUser = await Businessusers.findOne({
            where: {
                bus_email: req.body.bus_email,
                is_active: 1
            }
        });
        if (!!existUser) {
            return res.status(200).send(responsesCommon.formatErrorMessage("Email already exist!", 400, null));

        }
        const createdUser = await Businessusers.create(req.body);
        if (!!createdUser) {
            const _createdUser = createdUser?.dataValues;
            const sessionToken = await saveSession(_createdUser, 'business');
            if (!!sessionToken) {
                return res.status(200).send(responsesCommon.formatSuccessMessage("User created successfully!", _createdUser, sessionToken?.userToken, 0, null, 200));
            }
            return res.status(200).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));
        }

    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    boLoginHandler,
    boRegisterHandler
}
