require('dotenv').config()
const router = require('express').Router()


router.get('/', (req, res) => {
    res.render('help', {user: req.user, gapi: process.env.GOOGLE_API})
})

module.exports = router