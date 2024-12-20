const axios = require('axios');
const Users = require('../../models').businessusers;
const qs = require('querystring');
const businessUserServices = require('../../services/businessuserservices');

const responsesCommon = require('../../common/response.common');
const Permissions = require("../../models").permissions;
const Menu = require("../../models").menu;

async function getPermissionsAndMenus(userId) {
    try {
        const permissions = await Permissions.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Menu,
                    as: "menu",
                    where: { status: true },
                   
                },
            ],
        });
        return permissions.map((permission) => permission.menu);
    } catch (error) {
        console.log("error", error)
        throw new Error("Error fetching permissions and menus");
    }
}
const linkedInLogin = async (req, res) => {
    const { userType = 'student' } = req.body
    // console.log('[Error At Start]',userType)
    const payload = {
        client_id: process.env.LinkedIN_CLIENT_ID,
        client_secret: process.env.LinkedIN_CLIENT_SECRET,
        redirect_uri: process.env.LinkedIN_REDIRECT_URI,
        grant_type: 'authorization_code',
        code: req.body.code
    };



    try {
        const { data } = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            qs.stringify(payload),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );


        const accessToken = data.access_token;
        if (accessToken) {
            const fullData = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (fullData?.data?.email) {
                const bodyData = {
                    emailId: fullData?.data?.email,
                    loginType: "linkedin"

                }
                const result = await businessUserServices.getLoginDetails(bodyData);

                if (result.code === 200) {

                    const userRes = result.data;
                    const sessiontoken = await businessUserServices.saveSession(userRes);
                    if (sessiontoken) {
                        delete userRes.password;
                        await businessUserServices?.assignPermissionsIfNotExist(userRes.id)
                        const menus = await getPermissionsAndMenus(userRes.id);
                        userRes["menus"] = menus;
                        return res.status(200).send(responsesCommon.formatSuccessMessage(
                            'User logged in successfully',
                            userRes,
                            sessiontoken.userToken,
                            1,
                            ''
                        )
                        );
                    } else {
                        return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!', 400, null));
                    }
                }
                else {
                    const bodyData = {
                        bus_email: fullData?.data?.email,
                        login_type: 'LinkedIn',
                        first_name: fullData?.data?.given_name,
                        last_name: fullData?.data?.family_name,
                        provider_token: accessToken,
                        profile_url: fullData?.data?.picture,
                        roles: userType
                    }
                    const createdUser = await businessUserServices.createNewUser(bodyData, res);
                    if (createdUser.code == 200) {
                        const userRes = JSON.parse(JSON.stringify(createdUser));
                        await businessUserServices?.assignPermissionsIfNotExist(userRes.id)
                        const menus = await getPermissionsAndMenus(userRes.id);
                        userRes["menus"] = menus;
                        delete userRes.data.password;
                        const { data } = userRes;
                        await axios.post(`${process.env.APP_NODE_URL}/api/user/createNotifications`, {
                            user_id: data?.id,
                            title: `Hi <strong>${data?.first_name || ""} ${data?.last_name || ""}</strong> , Welcome to <strong>Tecdemy</strong> - Your learning journey begins here!`,
                            org: "tecdemy",
                            external_url_title: "",
                            external_url: ``,
                            category: "message"
                        })
                        return res
                            .status(200)
                            .send(
                                responsesCommon.formatSuccessMessage(
                                    "User created successfully!!",
                                    userRes,
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
                }
            }

        }
        return res.status(500).json({ error: 'Access token not received from LinkedIn' });

    } catch (error) {
        console.error('Error fetching LinkedIn access token:', error?.response?.data);
        return res.status(500).json({ error: 'Failed to authenticate with LinkedIn' });
    }
};

module.exports = {
    linkedInLogin
};
