const router = require('express').Router(),
    Ride = require('../schemas/rideSchema')

router.get('/', (req, res) => {
    res.render('verify')
})

router.post('/', async (req, res) => {

})

module.exports = router