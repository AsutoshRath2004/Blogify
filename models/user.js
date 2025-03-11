const { error } = require('console');
const { createHmac, randomBytes } = require('crypto')
const { createWebToken } = require('../services/authentication')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: '/default.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(12).toString()
    const hashedpassword = createHmac('sha256', salt).update(user.password).digest('hex')
    this.salt = salt
    this.password = hashedpassword
    next()
})

userSchema.static('matchPasswordandCreateToken', async function (email, password) {
    const user = await this.findOne({ email }) 

    if(!user) throw new Error (" User not found...Please enter the correct email")

    const salt = user.salt
    const hashedPassword = user.password
    
    const passwordProvided = createHmac('sha256', salt).update(password).digest('hex')

    if( hashedPassword !== passwordProvided) { throw new Error ('Wrong Password !!!') }

    const token = createWebToken(user)
    return token
})

const User = model('user', userSchema)

module.exports = {
    User
}