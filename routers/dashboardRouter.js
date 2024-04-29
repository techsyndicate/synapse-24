const router = require('express').Router()
const User = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    console.log(req.user)
    res.render('dashboard')
})

module.exports = router