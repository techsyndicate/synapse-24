const router = require('express').Router()
const User = require('../schemas/userSchema')

router.get('/', (req, res) => {
    res.redirect('/dashboard')
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const foundUser = await User.findById(id)
        console.log(foundUser.id)
        if (!foundUser) {
            return res.redirect('/dashboard')
        }
        return res.render('profile', {user: foundUser})
    } catch (err) {
        console.log(err)
        return res.redirect('/dashboard')
    }
})

module.exports = router