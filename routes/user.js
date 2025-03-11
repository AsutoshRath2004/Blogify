const { Router } = require('express')
const { User } = require('../models/user')

const router = Router()

router.get('/signup', (req, res) => {
    return res.render('../views/signup.ejs')
})

router.get('/signin', (req, res) => {
    return res.render('../views/signin.ejs')
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body
    await User.create({
        fullName: fullName,
        email: email,
        password: password
    })
    return res.redirect('/')
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    try {
        const token = await User.matchPasswordandCreateToken(email, password)
        return res.cookie('token', token).redirect('/')
    } catch (error) {
        return res.render('signin', {
            error: 'Wrong Email or Password'
        })
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

module.exports = router