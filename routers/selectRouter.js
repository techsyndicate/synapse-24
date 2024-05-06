const router = require('express').Router()
const Ride = require('../schemas/rideSchema')

router.get('/', async (req, res) => {
    const allRides = await Ride.find({})
    var verified = false
    for (let i = 0; i < allRides.length; i++) {
        if (allRides[i].riders.includes(req.user.email)) {
            if (allRides[i].vehicle == 'bus') {
                verified = true
                break
            }
        }
    }
    if (verified) {
        return res.render('select', {user: req.user})
    } else {
        return res.redirect('/status')
    }
    console.log(verified)
})

module.exports = router