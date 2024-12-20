
const responsesCommon = require('../../common/response.common');
const experiences = require("../../models").experiences;

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function getExperienceDataHandler(req, res) {
    try{
        const {user_id} = req.body
        // Find all records from the DataModel
        const data = await experiences.findAll({
            where:{
                user_id:user_id
            }
        });

        return res.status(200).send(data)

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports= getExperienceDataHandler
