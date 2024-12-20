const responsesCommon = require('../../common/response.common');
const bocomments = require("../../models").bocomments;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */




async function updateCommentHandler(req, res) {
    try{       
        const {uuid, comment} = req.body

        await bocomments.update({ comment:comment}, { where: { uuid: uuid } })
        .then(() => {
            return res.status(200).send('Comment Updated Successfully');
        }).catch((error)=>{
            return res.status(404).send("Some Error Occured")
        })

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = updateCommentHandler