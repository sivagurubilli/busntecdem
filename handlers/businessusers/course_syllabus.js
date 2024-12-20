const responsesCommon = require('../../common/response.common');
const courses_syllabus = require("../../models").courses_syllabus;
const courses = require("../../models").courses;
const businessuser = require("../../models")?.businessusers;
const { uploadToS3 } = require("../../middleware/awsUpload");
/**
 * @description
 *
 * Course_syllabus manipulation 
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */


async function course_syllabusHandler(req, res) {
    try {
        let type = req.params.type
        let bodyData = req.body
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "success", data: {} }
            if (type && type == "list") {
                let catval = await courses_syllabus.findAll({})
                respn.data = JSON.parse(JSON.stringify(catval));
                resolve(respn)
            } else if (bodyData && bodyData.id && bodyData.course_id) {
                let catval = await courses.findAll({ where: { business_id: bodyData.id, id: bodyData.course_id } })
                // bodyData.id
                if (JSON.parse(JSON.stringify(catval)).length > 0) {
                    if (type && type == "add") {
                        if (bodyData && Object.keys(bodyData).length > 0) {
                            let insertdata = {
                                course_id: bodyData.course_id,
                                syllabus_title: bodyData.syllabus_title,
                                week: bodyData.week,
                                no_of_modules: bodyData.no_of_modules,
                                no_skills: bodyData.no_skills,
                                course_content: bodyData.course_content,
                                content_preview_video: bodyData.content_preview_video
                            }
                            await courses_syllabus.create(insertdata).then(e => {
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
                    } else if (type && type == "edit") {
                        if (bodyData && Object.keys(bodyData).length > 0 && bodyData.edit_id && bodyData.course_id) {
                            let insertdata = {}
                            let arr = ["syllabus_title", "week", "no_skills", "no_of_modules", "course_content", "content_preview_video"]
                            for (let i = 0; i < arr.length; i++) {
                                if (!("undefined" === typeof bodyData[arr[i]] || bodyData[arr[i]] == '' || bodyData[arr[i]] == null)) {
                                    insertdata[arr[i]] = bodyData[arr[i]]
                                }
                            }
                            await courses_syllabus.update(insertdata, {
                                where: {
                                    id: bodyData.edit_id
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
                } else {
                    resolve({ code: 400, err: "Check request config" })
                }

                console.log(JSON.parse(JSON.stringify(catval)).length);
                resolve(respn)
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
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
async function course_syllabus_video(req, res) {
    try {
        let type = req.params.type
        let bodyData = req.body
        let result = await new Promise(async (resolve, reject) => {
            let respn = { code: 200, msg: "success", data: {} }
            if (type && type == "list") {
                let catval = await courses_syllabus.findAll({})
                respn.data = JSON.parse(JSON.stringify(catval));
                resolve(respn)
            } else if (bodyData && bodyData.id && bodyData.course_id) {
                let catval = await courses.findAll({ where: { business_id: bodyData.id, id: bodyData.course_id } })
                if (JSON.parse(JSON.stringify(catval)).length > 0) {
                    if (type && type == "add") {
                        if (bodyData && Object.keys(bodyData).length > 0) {
                            let insertdata = {
                                course_id: bodyData.course_id,
                                syllabus_title: bodyData.syllabus_title,
                                week: bodyData.week,
                                no_of_modules: bodyData.no_of_modules,
                                no_skills: bodyData.no_skills,
                                course_content: bodyData.course_content,
                                content_preview_video: bodyData.content_preview_video
                            }
                            await courses_syllabus.create(insertdata).then(e => {
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
                    } else if (type && type == "edit") {
                        if (bodyData && Object.keys(bodyData).length > 0 && bodyData.edit_id && bodyData.course_id) {
                            let insertdata = {}
                            let arr = ["syllabus_title", "week", "no_skills", "no_of_modules", "course_content", "content_preview_video"]
                            for (let i = 0; i < arr.length; i++) {
                                if (!("undefined" === typeof bodyData[arr[i]] || bodyData[arr[i]] == '' || bodyData[arr[i]] == null)) {
                                    insertdata[arr[i]] = bodyData[arr[i]]
                                }
                            }
                            console.log(insertdata);
                            await courses_syllabus.update(insertdata, {
                                where: {
                                    id: bodyData.edit_id
                                }
                            }).then(e => {
                                console.log(e);
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
                } else {
                    resolve({ code: 400, err: "Check request config" })
                }

                console.log(JSON.parse(JSON.stringify(catval)).length);
                resolve(respn)
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
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

async function updateProfilePictureController(req, res) {
    try {
        const { files } = req?.files;
        const { name } = files;
        const { uuid } = req.body;
        const result = await uploadToS3(files, process.env.S3_BUCKET_NAME);
        if (!!result) {
            const updateUserProfile = await businessuser.update({ profile_url: result.Location }, {
                where: {
                    uuid: uuid,
                }
            })
            if (updateUserProfile) {
                return res.status(200).send(responsesCommon.apiformatSuccessMessage("Profile picture is updated successfully!", {
                    profile_url: result.Location
                }))
            }
            return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong", 400, null));
        }
    } catch (error) {
        console.error(error);
    }
    // // return;

    // const { uuid } = req.body;
    // const updateUserProfile = await businessuser.update({ profile_url: `${process.env.APP_NODE_URL}/bo-images/${filename}` }, {
    //     where: {
    //         uuid: uuid,
    //     }
    // })
    // if (updateUserProfile) {
    //     return res.status(200).send(responsesCommon.apiformatSuccessMessage("Profile picture is updated successfully!", {
    //         profile_url: `${process.env.APP_NODE_URL}/bo-images/${filename}`
    //     }))
    // }
    // return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong", 400, null));

}


module.exports = { course_syllabusHandler, course_syllabus_video, updateProfilePictureController }