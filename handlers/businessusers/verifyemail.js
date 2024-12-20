const businessUserServices = require('../../services/businessuserservices');
const responsesCommon = require('../../common/response.common');
const Businessusers = require('../../models').businessusers;

/**
 * @description
 *
 *  This function is used to verify otp
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

async function verifyEmailHandler(req,res){
    try {
        const bodyData = req.body;
        const otp = req.body.otp;
        const userId = req.body.userId;
        if( "undefined" === typeof bodyData.userId || bodyData.userId == '' || bodyData.userId == null){
            return res.status(400).send(responsesCommon.formatErrorMessage('Please provide identifier!', 400, null));
        }
        if("undefined" === typeof bodyData.otp || bodyData.otp == '' || bodyData.otp == null ) {
            return res.status(400).send(responsesCommon.formatErrorMessage('Please provide otp!...', 400, null));
        }
        await businessUserServices.verifyOtp(bodyData).then(async function(result){
            if( result.code = 200 ){
                const updateData = {
                    email_verified: true,
                    email_verify_token:''
                }
                await Businessusers.update(updateData,{where:{id:userId}}).then(async function(data){ 
                    const updatedData =  await businessUserServices.getUserById(userId);

                    const responseData =  JSON.parse(JSON.stringify(updatedData));
                    delete responseData.password;
                    var sessiontoken = await businessUserServices.saveSession(responseData,'Admin');  
                    return res.status(200).send(responsesCommon.formatSuccessMessage(
                            'Otp verified successfully',
                            responseData,
                            sessiontoken.userToken,
                            0,
                            ''
                        ));
                    });
            }else{
                return res.status(400).send(responsesCommon.formatErrorMessage('Invalid Otp', 400, null));
            }
           
        }).catch((err)=>{
            console.log("Err====",err);
            return res.status(400).send(responsesCommon.formatErrorMessage('Invalid Otp!...', 400, null));
        });
    } catch (error) {
        console.log("error=====",error);
        return res.status(400).send(responsesCommon.formatErrorMessage('Please Verify Data & try again!', 400, null));
    }
}

module.exports = verifyEmailHandler;