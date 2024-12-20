
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

async function deleteExperienceHandler(req, res) {
    try{
        
        const {id} = req.body

        const deleteExperience = await experiences.destroy({
                where: {
                  id: id // Specify the user's ID you want to delete
                }
        })
        .then(experienceDeleted => {
            if (experienceDeleted  === 1) {
                return res.status(200).send('Experience Deleted Successfully');
            } else {
                return res.status(401).send('Experience Not Found');
            }
        })

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports= deleteExperienceHandler
