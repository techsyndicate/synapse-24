const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('help')
})

module.exports = router