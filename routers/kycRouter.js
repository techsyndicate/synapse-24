const router = require('express').Router()
const User = require('../schemas/userSchema')
const Driver = require('../schemas/driverSchema')


router.get('/', async (req, res) => {
    if (req.user.type != "Driver" || req.user.type != "driver") {
        return res.redirect("/")
    }
    res.render('kyc')
})

router.post('/uploadKYC', async (req, res) => {

})

module.exports = router