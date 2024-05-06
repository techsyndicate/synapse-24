require('dotenv').config()

const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    passportInit = require('./utils/passport-config'),
    ejs = require('ejs'),
    app = express(),
    session = require('express-session'),
    flash = require('express-flash'),
    {ensureAuthenticated, forwardAuthenticated, ensureKyc} = require('./utils/authenticate'),
    PORT = process.env.PORT || 5000

const indexRouter = require('./routers/indexRouter'),
    loginRouter = require('./routers/loginRouter'),
    regRouter = require('./routers/regRouter'),
    logoutRouter = require('./routers/logoutRouter'),
    profileRouter = require('./routers/profileRouter'),
    dashboardRouter = require('./routers/dashboardRouter'),
    kycRouter = require('./routers/kycRouter'),
    rewardsRouter = require('./routers/rewardsRouter'),
    statusRouter = require('./routers/statusRouter'),
    helpRouter = require('./routers/helpRouter'),
    apiRouter = require('./routers/apiRouter'),
    selectRouter = require('./routers/selectRouter')
    
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '1mb'}))

passportInit(passport)
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));

mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log('MongoDB connected')})
.catch((e) => {console.log(e)})

// routers
app.use('/', indexRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/register', forwardAuthenticated, regRouter)
app.use('/logout', ensureAuthenticated, logoutRouter)
app.use('/profile', ensureAuthenticated, ensureKyc, profileRouter)
app.use('/dashboard', ensureAuthenticated, dashboardRouter)
app.use('/api', ensureAuthenticated, apiRouter)
app.use('/kyc', ensureAuthenticated, kycRouter)
app.use('/status', ensureAuthenticated, ensureKyc, statusRouter)
app.use('/help', ensureAuthenticated, ensureKyc, helpRouter)
app.use('/rewards', ensureAuthenticated, ensureKyc, rewardsRouter)
app.use('/select', ensureAuthenticated, selectRouter)

app.listen(PORT, console.log(`Ordin <3 TS listening on port ${PORT}`))