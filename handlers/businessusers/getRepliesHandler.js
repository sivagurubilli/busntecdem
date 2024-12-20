
const responsesCommon = require('../../common/response.common');
const boreply= require("../../models").boreply;
const businessusers = require("../../models").businessusers;
const { Op } = require('sequelize');

/**
 * @description
 *
 *  This function is used to bussiness user profile update and edit   
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function getRepliesHandler(req, res) {
    try{
        // Find all records from the DataModel

        const {comment_id} = req.body

        const data = await boreply.findAll({
            where:{
                status:1,
                comment_id:comment_id
            },
            // order: [['createdAt', 'DESC']]
        })

        const userIds = data.map((items) => items?.user_id);
        const commentIds = data.map((item) => item?.uuid);

   
        const users = await businessusers.findAll({
        where: {
            id: userIds,
            is_active:"1"
        },
        attributes: ["id", "first_name", "last_name", "profile_url"],
        });

        const commentReplies = await boreply.findAll({
        where: {
            comment_id: commentIds,
            // [Op.or]: [{ comment_id: commentIds }, { comment_id:  data.uuid}]
            status: "1",
        },
        // order: [["createdAt", "DESC"]],
        });


        const replyUserIds = commentReplies.map((items) => items?.user_id);
        const replyUsers = await businessusers.findAll({
        where: {
            id: replyUserIds,
            is_active:"1"
        },
        attributes: ["id", "first_name", "last_name", "profile_url"],
        });

        const updateRepliesData = commentReplies.map((items) => {
        const _items = items?.dataValues;
        return {
            ..._items,
            userDetails:
            replyUsers.find((fItems) => fItems?.id == items?.user_id) || {},
        };
        });

        const updateData = data.map((items) => {
            const _items = items?.dataValues;
            return {
              ..._items,
              userDetails: users.find((fItems) => fItems?.id == items?.user_id) || {},
              repliesOfReply: updateRepliesData.filter((fItems)=> fItems?.comment_id == items?.uuid) || [],
            };
          });
        
        // const userIds = data.map((items) => items?.user_id)
        // let users=[]     
        // for(let i=0; i<userIds.length; i++){
        //     const user = await businessusers.findOne({
        //         where: {
        //             id: userIds[i],
        //             is_active:"1"                
        //         },
        //         attributes: ['first_name', 'last_name', 'profile_url']
        //     })
        //     users.push(user)
        // }
    
        // return res.status(200).send({data:data, users:users})
        return res.status(200).send(updateData)

    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports= getRepliesHandler
