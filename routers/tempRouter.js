const router = require('express').Router()
const Ride = require('../schemas/rideSchema')
const User = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    const foundRide = await Ride.findOne({rideId: 'xHxW6J9lIiSER5fV1Kre'})
    await Ride.updateOne({rideId: 'xHxW6J9lIiSER5fV1Kre'}, {
        $set: {
            seats: ['a3']
        }
    })
})

module.exports = router