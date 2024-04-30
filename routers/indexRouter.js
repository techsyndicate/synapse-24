const router = require('express').Router()
const axios = require('axios');
const Rides = require('../schemas/rideSchema')
const Users = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    if (!req.user) return res.redirect('/login')
    if (req.user.status == 'busy') return res.redirect('/status')
    res.render('index', {user: req.user})
})

router.post('/', async (req, res) => {
    if (!req.user) return res.redirect('/login')
    const {location, latitude, longitude, myLatitude, myLongitude} = req.body
    function getFare(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;
        const degToRad = (angle) => angle * (Math.PI / 180);
        const φ1 = degToRad(lat1);
        const φ2 = degToRad(lat2);
        const Δφ = degToRad(lat2 - lat1);
        const Δλ = degToRad(lon2 - lon1);
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return (20 + (12.5 * distance)).toFixed(2);
    }
    const allDrivers = await Users.findOne({type: 'Driver', status: 'free'})
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var myNewRideId = ''
    if (!allDrivers) {
        return res.send('No drivers are currently available. Please wait for some time!')
    }
    const currentRides = await Rides.find({})
    for (let i = 0; i < currentRides.length; i++) {
        const maxLimit = currentRides[i].vehicle == 'auto' ? 3 : 10
        if (currentRides[i].riders.length >= maxLimit) {
            continue;
        } else {
            const newPeople = currentRides[i].riders,
                currentLocations = currentRides[i].location,
                currentPrices = currentRides[i].price
            if (newPeople.includes(req.user.email)) {
                return res.redirect('/')
            };
            newPeople.push(req.user.email)
            currentLocations.push(location)
            currentPrices.push(getFare(latitude, longitude, myLatitude, myLongitude))
            await Rides.updateOne({rideId: currentRides[i].rideId}, {
                $set: {
                    riders: newPeople,
                    location: currentLocations,
                    price: currentPrices
                }
            })
            await Users.updateOne({email: req.user.email}, {
                $set: {
                    status: 'busy'
                }
            })
            return res.redirect('/')
        }
    }
    for (let j = 0; j < 20; j++) {
        myNewRideId += chars[Math.floor(Math.random() * 62)]
    }
    const otp = Math.floor(Math.random() * 10000).toString()
    const finalOtp = otp.padStart(4, '0')
    const myDriverEmail = allDrivers.email
    const newRide = new Rides({
        riders: [req.user.email],
        location: [location],
        driver: myDriverEmail,
        vehicle: 'auto',
        otp: finalOtp,
        rideId: myNewRideId,
        price: [getFare(latitude, longitude, myLatitude, myLongitude)]
    })
    await newRide.save()
    await Users.updateOne({email: req.user.email}, {
        $set: {
            status: 'busy'
        }
    })
    await Users.updateOne({email: myDriverEmail}, {
        $set: {
            status: 'busy'
        }
    })
    return res.redirect('/')
})

module.exports = router
