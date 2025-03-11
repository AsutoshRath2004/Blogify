const JWT = require('jsonwebtoken')

const secret = '$blogify@1234'

function createWebToken (user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
    }
    const token = JWT.sign(payload, secret)
    return token
}

function verifyToken (token) {
    const payload = JWT.verify(token, secret)
    return payload
}

module.exports = {
    createWebToken,
    verifyToken
}