const responsesCommon = require('../../common/response.common');
const boreply = require("../../models").boreply;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */




async function updateReplyHandler(req, res) {
    try{
        
        const {uuid, reply_comment} = req.body

        boreply.update({reply_comment:reply_comment}, { where: { uuid: uuid } })
        .then(() => {
            return res.status(200).send('Reply Updated Successfully');
        }).catch((error)=>{
            return res.send(404).send("Some Error Occured")
        })

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = updateReplyHandler