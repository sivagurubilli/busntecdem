const responsesCommon = require('../../common/response.common');
const businessusers = require("../../models").businessusers;
const { saveSession } = require("../../services/businessuserservices")
/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function editHandler(req, res) {
    try {
        let bodyData = req.body
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "Profile updated successfully", data: {} }
            //  if (type && type == "edit") {
            if (bodyData && Object.keys(bodyData).length >= 1) {
                let insertdata = {}
                let key = ["bus_acnt_name", "mobile_number", "address", "city", "state", "country", "first_name", "last_name"]
                if (!("undefined" === typeof bodyData.bus_acnt_name || bodyData.bus_acnt_name == '' || bodyData.bus_acnt_name == null)) { insertdata.bus_acnt_name = bodyData.parent_id }
                for (let i = 0; i < key.length; i++) {
                    if (!("undefined" === typeof bodyData[key[i]] || bodyData[key[i]] == '' || bodyData[key[i]] == null)) {
                        insertdata[key[i]] = bodyData[key[i]]
                    } else {
                        respn = { code: 400, err: "MISSING DATA" }
                        break;
                    }
                }
                await businessusers.update(insertdata, {
                    where: {
                        id: bodyData.id
                    }
                }).then(async (e) => {
                    let userinfo = await businessusers.findOne({
                        where: { id: bodyData.id },
                        attributes: ["bus_email", 'first_name', "last_name", 'mobile_number', 'address', 'email_verified', "bus_acnt_name", 'city', "state", "country", "createdAt",]
                    })
                    respn.data = JSON.parse(JSON.stringify(userinfo))
                    var sessiontoken = await saveSession(bodyData, 'business');
                    if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
                        respn.sessionToken = sessiontoken
                    }
                    else {
                        respn.sessionToken = null
                    }
                }).catch((e) => {
                    respn.code = 400
                    respn.err = e
                })

                resolve(respn)
            }
        })
        if (result.code == 200) {
            return res.status(200).send(responsesCommon.apiformatSuccessMessage(result.msg, result.data, result.sessionToken))
        } else if (result.code == 400) {
            return res.status(400).send(responsesCommon.formatErrorMessage(result.err, 400, null));
        } else {
            return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong", 400, null));
        }

    } catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = editHandler;