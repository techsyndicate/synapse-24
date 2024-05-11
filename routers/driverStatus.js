const router = require('express').Router(),
    Ride = require('../schemas/rideSchema'),
    User = require('../schemas/userSchema')

router.get('/', async (req,res) => {
    const user = req.user
    if (user.type != 'Driver') return res.redirect('/status')
    const allRides = await Ride.find({})
    var myRide = {};
    for (let i = 0; i < allRides.length; i++) {
        if (allRides[i].driver == user.email) {
            const minTime = Math.min(...allRides[i].time)
            const overallIndex = allRides[i].time.indexOf(minTime)
            myRide.vehicle = allRides[i].vehicle
            myRide.dropoff = allRides[i].location[overallIndex].slice(0, 32) + '...'
            myRide.time = minTime
            myRide.longitude = allRides[i].longitude[overallIndex]
            myRide.latitude = allRides[i].latitude[overallIndex]
        }
    }
    res.render("driverStatus", {user: user, ride: myRide})
})

router.post('/vehicle', async (req, res) => {
    const user = req.user
    const {vehicle} = req.body
    if (vehicle != 'bus' && vehicle != 'auto') {
        console.log('invalid')
        return res.redirect('/driverStatus')
    }
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].driver == user.email) {
            for (let j = 0; j < foundRides[i].riders.length; j++) {
                console.log(j)
                var newFare = foundRides[i].price[j];
                const currentDistance = foundRides[i].distance[j]
                if (foundRides[i].vehicle == 'bus' && vehicle == 'auto') {
                    newFare = (20 + (4.5 * currentDistance)).toFixed(2)
                } else if (foundRides[i].vehicle == 'auto' && vehicle == 'bus') {
                    newFare = (50 + (12.5 * currentDistance)).toFixed(2)
                }
                foundRides[i].price[j] = newFare
            }
            console.log(foundRides[i])
            await Ride.updateOne({rideId: foundRides[i].rideId}, {
                $set: {
                    vehicle: vehicle,
                    price: foundRides[i].price
                }
            })
            return res.redirect('/status')
        }
    }
})

router.get('/cancel', async (req, res) => {
    const user = req.user
    await Ride.deleteOne({driver: user.email})
    res.redirect('/rewards')
})

module.exports = router