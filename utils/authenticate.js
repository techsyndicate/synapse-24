const passport = require('passport')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else res.redirect('/login');
  }

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    else{
      res.redirect('/')
    }
}

function ensureKyc(req, res, next) {
    if (req.user.kyc) {
      return next()
    } else {
      return res.redirect('/kyc')
    }
}

module.exports = { ensureAuthenticated, forwardAuthenticated, ensureKyc};