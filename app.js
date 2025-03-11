require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const { Blog } = require('./models/blog')
const { checkTokenValidationForUser } = require('./middlewares/auth')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB Connected'))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkTokenValidationForUser('token'))
app.use(express.static(path.resolve('./public')))

app.set('view engine', 'ejs') 
app.set('home', path.resolve('/views'))

app.get('/', async (req, res) => {
    const allblogs = await Blog.find({})
    return res.render('home', {
        user: req.user,
        blogs: allblogs
    }) 
}) 
app.use('/', userRoute)
app.use('/', blogRoute)


app.listen(port, () => console.log(`Server Stared on port ${port}!`))