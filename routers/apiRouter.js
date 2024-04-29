const router = require('express').Router()
const User = require('../schemas/userSchema')

router.post('/claimReward', async (req, res) => {
    const {company} = req.body
    const companyList = ['prime', 'netflix', 'spotify', 'fifa', 'amazon', 'flipkart', 'roblox', 'adobe']
    if (!companyList.includes(company)) {
        return res.send('There was an error. Please try again.')
    }
    if (req.user.points < 1000) {
        return res.send('You don\'t have enough points to redeem this reward!')
    }
    try {
        const foundUser = await User.findOne({email: req.user.email}),
            currentRewards = foundUser.rewards
        if (currentRewards.includes(company)) {
            return res.send('This reward has already been redeemed!')
        }
        currentRewards.push(company)
        await User.updateOne({email: req.user.email}, {
            $set: {
                points: foundUser.points - 1000,
                rewards: currentRewards
            }
        })
        return res.send(`Bravo! You have now claimed your ${company} membership.`)
    } catch (e) {
        console.log(e)
        return res.send("There was an error. Please try again.")
    }
})

module.exports = router