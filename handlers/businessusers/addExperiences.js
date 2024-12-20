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




async function experienceHandler(req, res) {
    try{
        
        const {id, uuid, name, yoe, duration, role, startingDate, endingDate} = req.body
        
        const experienceData = await experiences.create({
            user_id:id,
            uuid:uuid,
            organization_name:name,
            yoe:yoe,
            duration:duration,
            experience_role:role,
            startingDate:startingDate,
            endingDate:endingDate,
            isEditable:true
        })
    
        return res.status(200).send('Experience Added Successfully');
        
        
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = experienceHandler