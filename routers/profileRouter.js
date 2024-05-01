const router = require('express').Router()
const User = require('../schemas/userSchema')

router.get('/', (req, res) => {
    res.render('profile')
})

module.exports = router