const router = require('express').Router()
const User = require('../schemas/userSchema')
const Driver = require('../schemas/driverSchema')


router.get('/', async (req, res) => {
    res.render('kyc')
})

router.post('/uploadKYC', async (req, res) => {
    // const {kycImage} = req.body
    // console.log(kycImage)
    // res.redirect('/kyc')
    const reqUser = await User.findOne({email: req.user.email})
    let name = reqUser.fname + " " + reqUser.lname
    const newDriver = new Driver({
        email: req.user.email,
        name: name,
        kyc: "true"
     })
     await newDriver.save()
     console.log(newDriver)

    await User.updateOne({email: req.user.email}, {
        $set: {
            type: "Driver"
        }
    })
     res.redirect("/")
})

module.exports = router