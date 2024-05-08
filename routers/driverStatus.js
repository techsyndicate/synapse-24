const router = require('express').Router()

router.get('/', async (req,res) => {
    
    res.render("driverStatus", {user: req.user})
})

module.exports = router