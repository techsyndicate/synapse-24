const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('rewards', {user: req.user})
})

module.exports = router