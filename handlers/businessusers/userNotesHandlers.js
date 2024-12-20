
const responsesCommon = require('../../common/response.common');
const bousernotes = require("../../models").bousernotes;
const { v4: uuidv4 } = require('uuid');

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function createUserNotesHandler(req, res) {
    try{
        const {user_id, course_id, section_name, video_title, note, timestamp} = req.body        
        const createUserNotes = await bousernotes.create({
            uuid:uuidv4(),
            user_id:user_id,
            course_id:course_id,
            section_name:section_name,
            video_title:video_title,
            note:note,
            timestamp:timestamp,
            status:"1"
        })

        if(!!createUserNotes){
            return res.status(200).send('Note Created Successfully');
        }else{
            return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
        }


    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

async function getUserNotesHandler(req, res) {
    try{
        // Find all records from the DataModel

        const {user_id, course_id} = req.body

        const AllUserNotes = await bousernotes.findAll({
            where:{
                user_id:user_id,
                course_id:course_id,
                status:1,
            },
            order: [['createdAt', 'DESC']]
        })

        if(!!AllUserNotes){
            return res.status(200).send(AllUserNotes)
        }else{
            return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
        }
        

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
async function updateUserNotesHandler(req, res) {
    try{      
        const {uuid, note} = req.body

        bousernotes.update({note:note}, { where: { uuid: uuid } })
        .then(() => {
            return res.status(200).send('Note Updated Successfully');
        }).catch((error)=>{
            return res.send(404).send("Some Error Occured")
        })

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
async function deleteUserNotesHandler(req, res) {
    try{
        
        const {uuid} = req.body

        bousernotes.update({ status:0}, { where: { uuid: uuid } })
        .then(() => {
            return res.status(200).send('Note Deleted Successfully');
        }).catch((error)=>{
            return res.send(404).send("Some Error Occured")
        })
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}
module.exports= {
    createUserNotesHandler,
    getUserNotesHandler,
    updateUserNotesHandler,
    deleteUserNotesHandler,
}
