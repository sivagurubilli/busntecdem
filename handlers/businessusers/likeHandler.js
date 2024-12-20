const responsesCommon = require('../../common/response.common');
const bocomments = require("../../models").bocomments;
const bo_likes = require("../../models").bo_likes;
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






async function likeHandler(req, res) {
    try{       
        const {uuid, likes, comment_id, user_id, dislikes} = req.body.data

        const liker = await bo_likes.findOne({
            where:{
                user_id:user_id,
                comment_id:comment_id
            }
        })

        if(!liker){
            const createLiker = await bo_likes.create({
                user_id:user_id,
                comment_id:comment_id,
                isLike:"false",
                isDislike:"false"
            })
            if(!!createLiker){
                const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:comment_id } })
                if(!!updateLiker){
                    const updateLikes = await bocomments.increment('likes', {
                        by: 1,
                        where: {
                          uuid: comment_id,
                        }
                    }).then(() => {
                            return res.status(200).send("like");
                        }).catch((error)=>{
                             return res.status(404).send("Some Error Occured")
                        })
                }
            }
        }
        else{           
            if(liker.isLike==="false" && liker.isDislike==="true" && !dislikes<=0){
                    const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:comment_id } })
                    if(!!updateLiker){
                        const updateLikes = await bocomments.decrement('dislikes', {
                            by: 1,
                            where: {
                              uuid: comment_id,
                            }
                        })
                        if(!!updateLikes){
                            const updateLikes = await bocomments.increment('likes', {
                                by: 1,
                                where: {
                                  uuid: comment_id,
                                }
                            }).then(()=>{
                                return res.status(200).send("Like")
                            }).catch((error)=>{
                                return res.status(404).send("Some Error Occured")
                           })
                        }
                        
                    }                   
            } 
            else if(liker.isLike === "true" && liker.isDislike === "false"){
                    const updateLiker = await bo_likes.update({isLike:"false", isDislike:"false"}, { where: {user_id:user_id, comment_id:comment_id } }) 
                    if(!!updateLiker){
                        const updateLikes = await bocomments.decrement('likes', {
                            by: 1,
                            where: {
                              uuid: comment_id,
                            }
                        }).then(() => {
                                return res.status(200).send('unlike');
                            }).catch((error)=>{
                                 return res.status(404).send("Some Error Occured")
                            })
                    }              
                 
            }   
            else if(liker.isLike === "false" && liker.isDislike === "false"){
                    const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:comment_id } })
                    if(!!updateLiker){
                        const updateLikes = await bocomments.increment('likes', {
                            by: 1,
                            where: {
                              uuid: comment_id,
                            }
                        }).then(() => {
                                return res.status(200).send("like");
                            }).catch((error)=>{
                                 return res.status(404).send("Some Error Occured")
                            })              
                    }
            }                     
        }
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

async function dislikeHandler(req, res) {
    try{       
        const {uuid, dislikes, comment_id, user_id, likes} = req.body.data

        const disliker = await bo_likes.findOne({
            where:{
                user_id:user_id,
                comment_id:comment_id
            }
        })

        if(!disliker){
            const createDisliker = await bo_likes.create({
                user_id:user_id,
                comment_id:comment_id,
                isLike:"false",
                isDislike:"false"
            })
            if(!!createDisliker){
                const updateDisliker  = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:comment_id } })
                if(!!updateDisliker){
                    const updateDislikes = await bocomments.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: comment_id,
                        }
                    }).then(() => {
                            return res.status(200).send('dislike');
                        }).catch((error)=>{
                             return res.status(404).send("Some Error Occured")
                        })                   
                }
            }           
        }
        else{           
            if(disliker.isDislike==="false" && disliker.isLike==="true" && !likes<=0){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:comment_id } })
                if(!!updateDisliker){
                    const updateLikes = await bocomments.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: comment_id,
                        }
                    }).then(async() => {
                        const updateLikes = await bocomments.decrement('likes', {
                            by: 1,
                            where: {
                              uuid: comment_id,
                            }
                        }).then(()=>{
                            return res.status(200).send("dislike")
                        })
                    })
                }               
            }   
            if(disliker.isDislike==="false" && disliker.isLike==="false"){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:comment_id } })
                if(!!updateDisliker){
                    const updateLikes = await bocomments.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: comment_id,
                        }
                    }).then(()=>{
                        return res.status(200).send("Dislike")
                    }).catch((error)=>{
                            return res.status(404).send("Some Error Occured")
                    })
                    
                }
            }   
            if(disliker.isDislike==="true" && disliker.isLike==="false"){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"false"}, { where: {user_id:user_id, comment_id:comment_id } })
                if(!!updateDisliker){
                    const updateDislikes = await bocomments.decrement('dislikes', {
                        by: 1,
                        where: {
                          uuid: comment_id,
                        }
                    }).then(()=>{
                        return res.status(200).send("dislike removed")
                    }).catch((error)=>{
                        return res.status(404).send("Some Error Occured")
                   }) 
                }
            }                                 
        }
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

async function replyLikeHandler(req, res) {
    try{       
        const {uuid, likes, reply_id, user_id, dislikes} = req.body.data

        const liker = await bo_likes.findOne({
            where:{
                user_id:user_id,
                comment_id:reply_id
            }
        })

        if(!liker){
            const createLiker = await bo_likes.create({
                user_id:user_id,
                comment_id:reply_id,
                isLike:"false",
                isDislike:"false"
            })
            if(!!createLiker){
                const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:reply_id } })
                if(!!updateLiker){
                    const updateLikes = await boreply.increment('likes', {
                        by: 1,
                        where: {
                          uuid: reply_id,
                        }
                    }).then(() => {
                            return res.status(200).send("like");
                        }).catch((error)=>{
                             return res.status(404).send("Some Error Occured")
                        })
                }
            }
        }
        else{           
            if(liker.isLike==="false" && liker.isDislike==="true"){
                    const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:reply_id } })
                    if(!!updateLiker){
                        const updateLikes = await boreply.decrement('dislikes', {
                            by: 1,
                            where: {
                              uuid: reply_id,
                            }
                        })
                        if(!!updateLikes){
                            const updateLikes = await boreply.increment('likes', {
                                by: 1,
                                where: {
                                  uuid: reply_id,
                                }
                            }).then(()=>{
                                return res.status(200).send("Like")
                            }).catch((error)=>{
                                return res.status(404).send("Some Error Occured")
                           })
                        }
                        
                    }                   
            } 
            else if(liker.isLike === "true" && liker.isDislike === "false"){
                    const updateLiker = await bo_likes.update({isLike:"false", isDislike:"false"}, { where: {user_id:user_id, comment_id:reply_id } }) 
                    if(!!updateLiker){
                        const updateLikes = await boreply.decrement('likes', {
                            by: 1,
                            where: {
                              uuid: reply_id,
                            }
                        }).then(() => {
                                return res.status(200).send('unlike');
                            }).catch((error)=>{
                                 return res.status(404).send("Some Error Occured")
                            })
                    }              
                 
            }   
            else if(liker.isLike === "false" && liker.isDislike === "false"){
                    const updateLiker = await bo_likes.update({isLike:"true", isDislike:"false"}, { where: {user_id:user_id, comment_id:reply_id } })
                    if(!!updateLiker){
                        const updateLikes = await boreply.increment('likes', {
                            by: 1,
                            where: {
                              uuid: reply_id,
                            }
                        }).then(() => {
                                return res.status(200).send("like");
                            }).catch((error)=>{
                                 return res.status(404).send("Some Error Occured")
                            })              
                    }
            }  
        }                   
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

async function replyDislikeHandler(req, res) {
    try{       
        const {uuid, dislikes, reply_id, user_id, likes} = req.body.data

        const disliker = await bo_likes.findOne({
            where:{
                user_id:user_id,
                comment_id:reply_id
            }
        })

        if(!disliker){
            const createDisliker = await bo_likes.create({
                user_id:user_id,
                comment_id:reply_id,
                isLike:"false",
                isDislike:"false"
            })
            if(!!createDisliker){
                const updateDisliker  = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:reply_id } })
                if(!!updateDisliker){
                    const updateDislikes = await boreply.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: reply_id,
                        }
                    }).then(() => {
                            return res.status(200).send('dislike');
                        }).catch((error)=>{
                             return res.status(404).send("Some Error Occured")
                        })                   
                }
            }           
        }
        else{           
            if(disliker.isDislike==="false" && disliker.isLike==="true" && !likes<=0){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:reply_id } })
                if(!!updateDisliker){
                    const updateLikes = await boreply.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: reply_id,
                        }
                    }).then(async() => {
                        const updateLikes = await boreply.decrement('likes', {
                            by: 1,
                            where: {
                              uuid: reply_id,
                            }
                        }).then(()=>{
                            return res.status(200).send("dislike")
                        })
                    })
                }               
            }   
            if(disliker.isDislike==="false" && disliker.isLike==="false"){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"true"}, { where: {user_id:user_id, comment_id:reply_id } })
                if(!!updateDisliker){
                    const updateLikes = await boreply.increment('dislikes', {
                        by: 1,
                        where: {
                          uuid: reply_id,
                        }
                    }).then(()=>{
                        return res.status(200).send("Dislike")
                    }).catch((error)=>{
                            return res.status(404).send("Some Error Occured")
                    })
                    
                }
            }   
            if(disliker.isDislike==="true" && disliker.isLike==="false"){
                const updateDisliker = await bo_likes.update({isLike:"false", isDislike:"false"}, { where: {user_id:user_id, comment_id:reply_id } })
                if(!!updateDisliker){
                    const updateDislikes = await boreply.decrement('dislikes', {
                        by: 1,
                        where: {
                          uuid: reply_id,
                        }
                    }).then(()=>{
                        return res.status(200).send("dislike removed")
                    }).catch((error)=>{
                        return res.status(404).send("Some Error Occured")
                   }) 
                }
            }                                 
        }
    }catch (error) {
        return res.status(400).send(responsesCommon.formatErrorMessage(error, 400, null));
    }
}

module.exports = {
    likeHandler,
    dislikeHandler,
    replyLikeHandler,
    replyDislikeHandler
}