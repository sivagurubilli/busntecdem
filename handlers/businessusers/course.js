const responsesCommon = require('../../common/response.common');
const courses = require("../../models").courses;
/**
 * @description
 *
 * Course manipulation 
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */


async function course(req, res) {
    try {
        let type = req.params.type
        let bodyData = req.body
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "success", data: {} }
            if (type && type == "add") {
                if (bodyData && Object.keys(bodyData).length > 0) {
                    let insertdata = {
                        business_id: bodyData.id,
                        category_id: bodyData.category_id,
                        course_name: bodyData.course_name,
                        course_description: bodyData.course_description,
                        // course_preview_video: "link",
                        course_status: "active"
                    }
                    await courses.create(insertdata).then(e => {
                        respn.data = JSON.parse(JSON.stringify(e))
                    }).catch((e) => {
                        respn.code = 400
                        respn.err = e
                    })
                    resolve(respn)
                } else {
                    return resolve({
                        err: "Error in data",
                        code: 400
                    },)
                }
            } else if (type && type == "ChangeStatus") {
                if (bodyData && Object.keys(bodyData).length > 0 && bodyData.id) {
                    let insertdata = {
                        status: bodyData.status == "active" ? "inactive" : "active"
                    }

                    await courses.update(insertdata, {
                        where: {
                            id: bodyData.course_id
                        }
                    }).then(e => {
                        respn.msg = "cours" + ` ${insertdata.status} ` + "now"
                        respn.data = JSON.parse(JSON.stringify(e))
                    }).catch((e) => {
                        respn.code = 400
                        respn.err = e
                    })
                    resolve(respn)
                } else {
                    return resolve({
                        err: "Error in data",
                        code: 400
                    },)
                }

            } else if (type && type == "list") {
                if (bodyData && Object.keys(bodyData).length > 0 && bodyData.include && bodyData.include == "inactive") {
                    let catval = await courses.findAll({})
                    respn.data = JSON.parse(JSON.stringify(catval));
                    resolve(respn)
                } else {
                    let catval = await courses.findAll({ where: { course_status: "active" } })
                    respn.data = JSON.parse(JSON.stringify(catval));
                    resolve(respn)
                }
            } else if (type && type == "edit") {
                if (bodyData && Object.keys(bodyData).length > 0 && bodyData.course_id) {
                    let insertdata = {}
                    if (!("undefined" === typeof bodyData.category_id || bodyData.category_id == '' || bodyData.category_id == null)) { insertdata.category_id = bodyData.category_id }
                    if (!("undefined" === typeof bodyData.course_name || bodyData.course_name == '' || bodyData.course_name == null)) { insertdata.course_name = bodyData.course_name }
                    if (!("undefined" === typeof bodyData.course_description || bodyData.course_description == '' || bodyData.course_description == null)) { insertdata.course_description = bodyData.course_description }
                    await courses.update(insertdata, {
                        where: {
                            id: bodyData.course_id
                        }
                    }).then(e => {
                        respn.msg = "Course updated"
                        respn.data = JSON.parse(JSON.stringify(e))
                    }).catch((e) => {
                        respn.code = 400
                        respn.err = e
                    })
                    resolve(respn)
                } else {
                    return resolve({
                        err: "Error in data",
                        code: 400
                    },)
                }
            } else {
                return res.status(400).send(responsesCommon.formatErrorMessage("Please check URL", 400, null));
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
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = course