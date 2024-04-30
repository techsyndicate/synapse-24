const router = require('express').Router()
const axios = require('axios');


router.get('/', async (req, res) => {
    if (!req.user) return res.redirect('/login')
    res.render('index', {user: req.user})
})

module.exports = router