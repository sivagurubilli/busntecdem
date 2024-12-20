const responsesCommon = require("./response.common")
const jwt = require("jsonwebtoken")
/**
 * @description
 *
 *   Auth file
 *
 *
 */
auth = async (req, res, next) => {
    let data = req.headers['x-api-key']
    if (!("undefined" === typeof data || data == '' || data == null)) {
        await jwt.verify(data, process.env.AUTH_TOKEN, (err, decoded) => {
            if (err && err) {
                res.status(400).send(responsesCommon.formatErrorMessage("Token Expired", 400, null));
            } else if (decoded != null || decoded != undefined) {
                if (decoded.userId && decoded.userId) {
                    req.body.id = decoded.userId; next();
                } else { res.status(400).send(responsesCommon.formatErrorMessage("Token Error", 400, null)); }
            } else {
                res.status(400).send(responsesCommon.formatErrorMessage("Token Error", 400, null));
            }
        })
    } else {
        res.status(400).send(responsesCommon.formatErrorMessage("Token Error", 400, null))
    }
}

module.exports = auth
