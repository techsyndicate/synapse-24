const router = require('express').Router()
const Ride = require('../schemas/rideSchema')
const User = require('../schemas/userSchema')

router.get('/', async (req, res) => {
    const allUsers = await User.find({})
    for (let i = 0; i < allUsers.length; i++) {
        await User.updateOne({email: allUsers[i].email}, {
            $set: {
                status: 'free'
            }
        })
    }
})

module.exports = router