const router = require('express').Router()
const User = require('../schemas/userSchema')
const Ride = require('../schemas/rideSchema')

router.get('/', async (req, res) => {
    const foundUser = await User.findOne({email: req.user.email})
    var myRide = {riders: []};
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
            const overallIndex = foundRides[i].riders.indexOf(req.user.email)
            myRide.price = foundRides[i].price[overallIndex]
            myRide.distance = foundRides[i].distance[overallIndex]
            myRide.time = foundRides[i].time[overallIndex]
            myRide.otp = foundRides[i].otp
            for (let k = 0; k < foundRides[i].riders.length; k++) {
                const theFoundUser = await User.findOne({email: foundRides[i].riders[k]})
                myRide.riders.push(`${theFoundUser.fname} ${theFoundUser.lname}`)
            }
            if (foundRides[i].location[overallIndex].length > 20) {
                myRide.dropOff = foundRides[i].location[overallIndex].substring(0, 20) + '...'
            } else {
                myRide.dropOff = foundRides[i].location[overallIndex]
            }
            if (foundRides[i].myLocation[overallIndex].length > 20) {
                myRide.myLocation = foundRides[i].myLocation[overallIndex].substring(0, 20) + '...'
            } else {
                myRide.myLocation = foundRides[i].myLocation[overallIndex]
            }
            break
        }
    }
    res.render('status', {user: foundUser, ride: myRide})
})

module.exports = router