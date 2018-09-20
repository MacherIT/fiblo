var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var usuarioModel = require('../models/usuarioModel.js')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    function (username, password, done) {
      usuarioModel.findOne({ where: { email: username } }).then(
        usuario => {
          // Return if usuario not found in database
          if (!usuario) {
            return done(null, false, { message: 'usuario not found' })
          }
          // Return if password is wrong
          if (!usuario.validPassword(password)) {
            return done(null, false, { message: 'Password is wrong' })
          }
          // If credentials are correct, return the usuario object
          return done(null, usuario)
        },
        error => {
          done(error)
        }
      )
    }
  )
)
