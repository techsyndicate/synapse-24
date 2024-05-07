const router = require('express').Router()
const Ride = require('../schemas/rideSchema'),
    User = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    const allRides = await Ride.find({})
    var verified = false
    var seats = []
    var mySeat = 'noseatfound'
    var myPrice = myDriver = myTime = myDistance = myPickup = myDropOff = myLatitude = myLongitude = ''
    var foundDriver;
    for (let i = 0; i < allRides.length; i++) {
        if (allRides[i].riders.includes(req.user.email)) {
            foundDriver = await User.findOne({email: allRides[i].driver})
            const overallIndex = allRides[i].riders.indexOf(req.user.email)
            myPrice = allRides[i].price[overallIndex]
            myTime = allRides[i].time[overallIndex]
            myDistance = allRides[i].distance[overallIndex]
            myPickup = allRides[i].myLocation[overallIndex].slice(0, 32) + '...'
            myDropOff = allRides[i].location[overallIndex].slice(0, 32) + '...'
            myLatitude = allRides[i].latitude[overallIndex]
            myLongitude = allRides[i].longitude[overallIndex]
            myDriver = allRides[i].driver
            if (allRides[i].vehicle == 'bus') {
                verified = true
                seats = allRides[i].seats
                mySeat = allRides[i].seats[overallIndex]
                break
            }
        }
    }
    if (verified) {
        return res.render('select', {
            user: req.user, 
            seats: seats, 
            mySeat: mySeat,
            price: myPrice,
            time: myTime,
            distance: myDistance,
            pickup: myPickup,
            dropoff: myDropOff,
            latitude: myLatitude,
            longitude: myLongitude,
            driver: myDriver,
            pfp: foundDriver.pfp
        })
    } else {
        return res.redirect('/status')
    }
})

router.post('/', async (req, res) => {
    try {
        const {seat} = req.body
        const allRides = await Ride.find({})
        var rideId = ''
        for (let i = 0; i < allRides.length; i++) {
            if (allRides[i].riders.includes(req.user.email)) {
                const overallIndex = allRides[i].riders.indexOf(req.user.email),
                    currentPrices = allRides[i].price
                allRides[i].seats[overallIndex] = seat
                allRides[i].price[overallIndex] = Number(allRides[i].price[overallIndex]) + 30
                await Ride.updateOne({rideId: allRides[i].rideId}, {
                    $set: {
                        seats: allRides[i].seats,
                        price: currentPrices
                    }
                })
                return res.sendStatus(200)
            }
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router