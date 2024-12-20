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




async function updateExperienceHandler(req, res) {
    try{
        
        const {id, user_id, organization_name, yoe, experience_role, startingDate, endingDate} = req.body

        experiences.update({ organization_name: organization_name,  yoe:yoe, experience_role:experience_role, startingDate:startingDate, endingDate:endingDate}, { where: { id: id } })
        .then(() => {
            return res.status(200).send('Experience Updated Successfully');
        }).catch((error)=>{
            return res.send(404).send("Some Error Occured")
        })

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = updateExperienceHandler