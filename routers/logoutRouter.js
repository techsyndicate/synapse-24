const router = require('express').Router()

router.get('/', (req, res) => {
    req.logout((err) => {
        if (err) console.log(err)
        return res.redirect('/login')
    });
})

module.exports = router