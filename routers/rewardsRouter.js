const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('rewards')
})

module.exports = router