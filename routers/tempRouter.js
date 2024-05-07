const router = require('express').Router()
const Ride = require('../schemas/rideSchema')
const User = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    res.render('temp')
})

module.exports = router