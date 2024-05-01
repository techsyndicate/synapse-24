const router = require('express').Router()
const User = require('../schemas/userSchema')
const path = require('path')
const fs = require('fs')
const imgur = require('imgur')
const axios = require('axios')

router.get('/', async (req, res) => {
    if (req.user.kyc) return res.redirect('/')
    res.render('kyc')
})

router.post('/uploadKyc', async (req, res) => {
    const imgData = req.body.imageUrlData
    const base64Hatao = imgData.replace(/^data:image\/png;base64,/, "")
    try {
        const response = await axios.post('https://api.imgur.com/3/upload', {
            image: base64Hatao,
            }, {
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_ID}`,
                },
            });
        await User.updateOne({email: req.user.email}, {
            kyc: true,
            pfp: response.data.data.link
        })
        console.log(response.data.data.link)
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = router