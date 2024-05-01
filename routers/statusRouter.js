const router = require('express').Router()
const User = require('../schemas/userSchema')
const Ride = require('../schemas/rideSchema')

router.get('/', async (req, res) => {
    const foundUser = await User.findOne({email: req.user.email})
    if (foundUser.status == 'free') return res.redirect('/')
    var myRide = {riders: []};
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
            const overallIndex = foundRides[i].riders.indexOf(req.user.email)
            const foundDriver = await User.findOne({email: foundRides[i].driver})
            myRide.price = foundRides[i].price[overallIndex]
            myRide.distance = foundRides[i].distance[overallIndex]
            myRide.time = foundRides[i].time[overallIndex]
            myRide.otp = foundRides[i].otp
            myRide.vehicle = foundRides[i].vehicle
            myRide.driver = foundDriver
            myRide.latitude = Number(foundRides[i].latitude[overallIndex])
            myRide.longitude = Number(foundRides[i].longitude[overallIndex])
            for (let k = 0; k < foundRides[i].riders.length; k++) {
                const theFoundUser = await User.findOne({email: foundRides[i].riders[k]})
                myRide.riders.push(theFoundUser)
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

router.post('/vehicle', async (req, res) => {
    const {vehicle} = req.body
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
            await Ride.updateOne({rideId: foundRides[i].rideId}, {
                $set: {
                    vehicle: vehicle
                }
            })
            return res.redirect('/status')
        }
    }
})

router.post('/cancel', async (req, res) => { 
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
            const overallIndex = foundRides[i].riders.indexOf(req.user.email)
            console.log(foundRides[i])
            foundRides[i].price.splice(overallIndex, 1)
            foundRides[i].riders.splice(overallIndex, 1)
            foundRides[i].location.splice(overallIndex, 1)
            foundRides[i].myLocation.splice(overallIndex, 1)
            foundRides[i].distance.splice(overallIndex, 1)
            foundRides[i].time.splice(overallIndex, 1)
            foundRides[i].latitude.splice(overallIndex, 1)
            foundRides[i].longitude.splice(overallIndex, 1)
            console.log(foundRides[i])
            await Ride.updateOne({rideId: foundRides[i].rideId}, {
                $set: {
                    price: foundRides[i].price,
                    riders: foundRides[i].riders,
                    location: foundRides[i].location,
                    myLocation: foundRides[i].myLocation,
                    distance: foundRides[i].distance,
                    time: foundRides[i].time,
                    latitude: foundRides[i].latitude,
                    longitude: foundRides[i].longitude
                }
            })
            await User.updateOne({email: req.user.email}, {
                $set: {
                    status: 'free'
                }
            })
            return res.redirect('/status')
            //riders, location, mylocation, distance, time, price
        }
    }
})

module.exports = router