const router = require('express').Router(),
    Ride = require('../schemas/rideSchema')

router.get('/', (req, res) => {
    // if (req.user.type != 'Driver') return res.redirect('/status')
    res.render('verify')
})

router.post('/', async (req, res) => {
    try {    
        const allRides = await Ride.find({})
        const {otp} = req.body
        for (let i = 0; i < allRides.length; i++) {
            if (allRides[i].riders.includes(req.user.email)) {
                if (otp == allRides[i].otp) {
                    console.log('Otp matched')
                    return res.sendStatus(200)
                } else {
                    console.log('Otp not matched')
                    return res.sendStatus(401)
                }
            }
        }
        return res.sendStatus(401)
    } catch (error) {
        console.log(error)
        res.sendStatus(502)
    }
})

module.exports = router