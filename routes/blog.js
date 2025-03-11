const { Router } = require('express')
const multer = require('multer')
const router = Router()
const { Blog } = require('../models/blog')
const { Comment } = require('../models/comment')
const path = require('path')

router.get('/addblog', (req, res) => {
    return res.render('addblog', {
        user: req.user
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname
      cb(null, name)
    }
})
  
const upload = multer({ storage: storage })

router.post('/addblog', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body
    const blog = await Blog.create({
        title: title,
        body: body,
        createdBy: req.user._id,
        coverImage: `/uploads/${req.file.filename}`
    })
    return res.redirect('/')
})

router.post('/comment/:id', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.id,
        createdBy: req.user._id
    })
    return res.redirect(`/${req.params.id}`)
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comment = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    return res.render('blog', {
        user: req.user,
        blog: blog,
        comment: comment
    })
})

module.exports = router