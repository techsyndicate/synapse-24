const router = require('express').Router()
const User = require('../schemas/userSchema')
const Ride = require('../schemas/rideSchema')

router.get('/', async (req, res) => {
    const user = req.user
    if (user.status == 'free') return res.redirect('/')
    var myRide = {riders: []};
    const foundRides = await Ride.find({})
    const allUsers = await User.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(user.email)) {
            const overallIndex = foundRides[i].riders.indexOf(user.email)
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
                for (let n = 0; n < allUsers.length; n++) {
                    if (allUsers[n].email == foundRides[i].riders[k]) {
                        myRide.riders.push(allUsers[n])
                    }
                }
                // const theFoundUser = await User.findOne({email: foundRides[i].riders[k]})
                // myRide.riders.push(theFoundUser)
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
    const isDriver = req.user.type === "Driver"
    // console.log("BC", isDriver)
    res.render('status', {user: req.user, ride: myRide, isDriver: isDriver})
})

router.post('/vehicle', async (req, res) => {
    const {vehicle} = req.body
    if (vehicle != 'bus' && vehicle != 'auto') {
        console.log('invalid')
        return res.redirect('/status')
    }
    const foundRides = await Ride.find({})
    for (let i = 0; i < foundRides.length; i++) {
        if (foundRides[i].riders.includes(req.user.email)) {
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
            foundRides[i].seats.splice(overallIndex, 1)
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
                    longitude: foundRides[i].longitude,
                    seats: foundRides[i].seats
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
