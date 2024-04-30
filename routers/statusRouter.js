const router = require('express').Router()


router.get('/', async (req, res) => {
    res.render('status')
    
})

module.exports = router