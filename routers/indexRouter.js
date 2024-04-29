const router = require('express').Router()
const axios = require('axios');


router.get('/', async (req, res) => {
    res.render('index')
    
})

module.exports = router