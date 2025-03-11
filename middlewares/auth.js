const { verifyToken } = require('../services/authentication')

function checkTokenValidationForUser (cookiename) {
    return (req, res, next) => {
        const checkToken = req.cookies[cookiename]
        if(!checkToken)
            return next()

        try {
            const userPayload = verifyToken(checkToken)
            req.user = userPayload
        } catch (error) {}

        return next()
    }
}

module.exports = {
    checkTokenValidationForUser
}