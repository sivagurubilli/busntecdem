const responsesCommon = require('../../common/response.common');
const category = require("../../models").category;
/**
 * @description
 *
 *  This function is used to login  
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */


async function categoryfun(req, res) {
    try {
        let type = req.params.type
        let bodyData = req.body
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "success", data: {} }
            if (type && type == "add") {
                if (bodyData && Object.keys(bodyData).length > 0) {
                    let str = bodyData.category
                    let value = str.replace(/[^a-zA-Z0-9]/g, '-')
                    let catval = await category.findAll({
                        where: {
                            category_slug: value
                        }
                    })
                    let catData = JSON.parse(JSON.stringify(catval));
                    let insertdata = {
                        category_name: bodyData.category,
                        parent_id: bodyData.parent_id ? body.parent_id : 0,
                        category_description: bodyData.discription,
                        category_image: "image url",
                        status: "active"
                    }
                    if (catData && catData.length > 0) {
                        let slug = value + `-${catData.length}`
                        insertdata.category_slug = slug
                        await category.create(insertdata).then(e => {
                            respn.data = JSON.parse(JSON.stringify(e))
                            respn.msg = "Category added successfully"
                        }).catch(e => {
                            respn.code = 400
                            respn.err = e
                        })
                    } else {
                        insertdata.category_slug = value
                        await category.create(insertdata).then(e => {
                            respn.data = JSON.parse(JSON.stringify(e))
                        }).catch((e) => {
                            respn.code = 400
                            respn.err = e
                        })
                    }
                    resolve(respn)
                } else {
                    return resolve({
                        err: "Error in data",
                        code: 400
                    },)
                }
            } else if (type && type == "ChangeStatus") {
                if (bodyData && Object.keys(bodyData).length > 0 && bodyData.cat_id) {
                    let insertdata = {
                        status: bodyData.status == "active" ? "inactive" : "active"
                    }

                    await category.update(insertdata, {
                        where: {
                            id: bodyData.cat_id
                        }
                    }).then(e => {
                        respn.msg = "Category" + ` ${insertdata.status} ` + "now"
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
                    let catval = await category.findAll({})
                    respn.data = JSON.parse(JSON.stringify(catval));
                    resolve(respn)
                } else {
                    let catval = await category.findAll({ where: { status: "active" } })
                    respn.data = JSON.parse(JSON.stringify(catval));
                    resolve(respn)
                }
            } else if (type && type == "edit") {
                if (bodyData && Object.keys(bodyData).length > 0 && bodyData.id) {
                    let insertdata = {}
                    if (!("undefined" === typeof bodyData.category_name || bodyData.category_name == '' || bodyData.category_name == null)) { insertdata.category_name = bodyData.category_name }
                    // if (!("undefined" === typeof bodyData.parent_id || bodyData.parent_id == '' || bodyData.parent_id == null)) { insertdata.parent_id = bodyData.parent_id }
                    if (!("undefined" === typeof bodyData.category_description || bodyData.category_description == '' || bodyData.category_description == null)) { insertdata.category_description = bodyData.category_description }
                    // if (!("undefined" === typeof bodyData.category_image || bodyData.category_image == '' || bodyData.category_image == null)) { insertdata.category_image = bodyData.category_image }
                    await category.update(insertdata, {
                        where: {
                            id: bodyData.cat_id
                        }
                    }).then(e => {
                        respn.msg = "Category updated"
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
                //   return res.status(200).send(responsesCommon.apiformatSuccessMessage("msg",{"data":"data"}))
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

module.exports = categoryfun