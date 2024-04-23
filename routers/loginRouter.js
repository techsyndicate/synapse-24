const router = require('express').Router()
const passport = require('passport')

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}))

module.exports = router