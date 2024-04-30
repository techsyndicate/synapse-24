const router = require('express').Router()
const User = require('../schemas/userSchema')
const Ride = require('../schemas/rideSchema')

router.get('/', async (req, res) => {
    const foundUser = await User.findOne({email: req.user.email})
    var myRide = {};
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
            const overallIndex = foundRides[i].riders.indexOf(req.user.email)
            myRide.price = foundRides[i].price[overallIndex]
            if (foundRides[i].location[overallIndex].length > 40) {
                myRide.dropOff = foundRides[i].location[overallIndex].substring(40) + '...'
            } else {
                myRide.dropOff = foundRides[i].location[overallIndex]
            }
            break
        }
    }
    res.render('status', {user: foundUser, ride: myRide})
})

module.exports = router