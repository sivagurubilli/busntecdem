
const responsesCommon = require('../../common/response.common');
const bucketlist = require('../../models').bucketlist;

/**
 * @description
 *
 *  This function is bucklist 
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function bucketlistHandler(req, res) {
    try {
        let type = req.params.type
        const bodyData = req.body;
        bodyData.course_id = 1
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "success", data: {} }
            let where = {
                user_id: bodyData.id,
                course_id: bodyData.course_id
            }
            if (type && type == "fetch") {
                await bucketlist.findAll({ where: where }).then((e) => {
                    let data = JSON.parse(JSON.stringify(e));
                    respn.data = data && data.length && data.length > 0 ? data[0] : {}
                    resolve(respn)
                }).catch(e => { resolve({ code: 400, err: "Error try again" }) })
            } else if (type && type == "update") {
                let insertdata = { data: bodyData.data ? bodyData.data : data[0].data }
                if (bodyData.editid && bodyData.editid) {
                    await bucketlist.update(insertdata, { where: { id: bodyData.editid } }).then(e => {
                        let data = JSON.parse(JSON.stringify(e));
                        respn.data = data
                        resolve(respn)
                    }).catch(e => { resolve({ code: 400, err: "Error try again" }) })
                } else {
                    await bucketlist.findAll({ where: where }).then((e) => {
                        let data = JSON.parse(JSON.stringify(e));
                        if (data && data.length && data.length > 0) {
                            bucketlist.update(insertdata, { where: { id: data[0]["id"] } }).then(e => {
                                let data = JSON.parse(JSON.stringify(e));
                                respn.data = data
                                resolve(respn)
                            }).catch(e => { resolve({ code: 400, err: "Error try again" }) })
                        } else {
                            insertdata.user_id = bodyData.id
                            insertdata.course_id = bodyData.course_id
                            bucketlist.create(insertdata).then((e) => {
                                let data = JSON.parse(JSON.stringify(e));
                                respn.data = data
                                resolve(respn)
                            }).catch(e => { resolve({ code: 400, err: "Error try again" }) })
                        }
                    })
                }

            } else {
                resolve({ code: 400, err: "Check request config" })
            }
        })
        if (result.code == 200) {
            return res.status(200).send(responsesCommon.apiformatSuccessMessage(result.msg, result.data))
        } else if (result.code == 400) {
            return res.status(400).send(responsesCommon.formatErrorMessage(result.err, 400, null));
        } else {
            return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong", 400, null));
        }


    } catch (error) {
        console.log("error=====", error);
        return res.status(400).send(responsesCommon.formatErrorMessage('Please Verify Data & try again!', 400, null));
    }
}

module.exports = bucketlistHandler;