var passport = require('passport')
var usuarioModel = require('../models/usuarioModel.js')
var mpc = require('../modules/mpc.js')
var mca = require('../modules/mca.js')
var crypto = require('crypto')

/**
 * usuarioController.js
 *
 * @description :: Server-side logic for managing usuarios.
 */
module.exports = {
  /**
   * usuarioController.list()
   */
  list: function (req, res) {
    usuarioModel.find({}).exec(function (err, usuarios) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting usuario.',
          error: err
        })
      }
      return res.json(usuarios)
    })
  },

  /**
   * usuarioController.show()
   */
  show: function (req, res) {
    var id = req.params.id ? req.params.id : req.payload.id
    usuarioModel.findOne({ where: { id: id } }).then(
      usuario => {
        if (!usuario) {
          return res.status(404).json({
            message: 'No such usuario'
          })
        }
        return res.json(usuario)
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting usuario.',
          error: error
        })
      }
    )
  },
  // //////////////
  mail_pass_check: (req, res) => {
    if (req.body.email) {
      usuarioModel.findOne({ email: req.body.email }, (err, usuario) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting usuario.',
            error: err
          })
        }
        if (usuario) {
          mpc(usuario.email, usuario.generateMailToken(), (error, info) => {
            if (error) {
              return res.status(500).json({ message: 'Ocurrió un error' })
            } else {
              return res.json()
            }
          })
        } else {
          return res.status(404).json()
        }
      })
    } else {
      return res.status(400).json({
        message: 'Error'
      })
    }
  },
  // //////////////
  login: (req, res) => {
    passport.authenticate('local', function (err, usuario, info) {
      var token

      // If Passport throws/catches an error
      if (err) {
        res.status(404).json(err)
        return
      }

      // If a usuario is found
      if (usuario) {
        token = usuario.generateJwt()
        res.status(200)
        res.json({ token: token })
      } else {
        // If usuario is not found
        res.status(401).json(info)
      }
    })(req, res)
  },

  /**
   * usuarioController.create()
   */

  create: function (req, res) {
    var usuario = usuarioModel.build({
      email: req.body.email,
      nombre: req.body.nombre,
      hash: req.body.hash,
      role: req.body.role
    })

    usuario.setPassword(req.body.password)
    usuario.generateActivationToken()

    usuario.save().then(
      usuario => {
        if (!req.headers.authorization) {
          mca(usuario.email, usuario.activation, (error, info) => {
            if (error) {
              console.log(error)
              return res.status(500).json({ message: 'Ocurrió un error', usuario: usuario })
            } else {
              return res.status(206).json()
            }
          })
        }
      },
      error => {
        return res.status(500).json({
          message: 'Error when creating usuario',
          error: error
        })
      }
    )
  },

  /**
   * usuarioController.update()
   */
  update: function (req, res) {
    var id = req.payload.id
    usuarioModel.findOne({ where: { id: id } }).then(
      usuario => {
        if (!usuario) {
          return res.status(404).json({
            message: 'No such usuario'
          })
        }

        usuario.email = req.body.email ? req.body.email : usuario.email
        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre
        usuario.hash = req.body.hash ? req.body.hash : usuario.hash
        usuario.role = req.body.role ? req.body.role : usuario.role

        usuario.save().then(
          usuario => {
            return res.json(usuario)
          },
          error => {
            return res.status(500).json({
              message: 'Error when updating usuario.',
              error: error
            })
          }
        )
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting usuario',
          error: error
        })
      }
    )
  },
  // /////////////
  ch_pass: function (req, res) {
    if (req.body.password) {
      usuarioModel.findOne({ id: req.payload.uid }, function (err, usuario) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting usuario',
            error: err
          })
        } else if (!usuario) {
          return res.status(404).json({
            message: 'No such usuario'
          })
        } else {
          usuario.setPassword(req.body.password)

          usuario.save().then((err, usuario) => {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating usuario.',
                error: err
              })
            }
            return res.json(usuario)
          })
        }
      })
    } else {
      return res.status(400).json({
        message: 'Error'
      })
    }
  },
  // /////////
  c_ac: function (req, res) {
    if (req.payload.acuid) {
      usuarioModel.findOne({ id: req.payload.acuid }, function (err, usuario) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting usuario',
            error: err
          })
        } else if (!usuario) {
          return res.status(404).json({
            message: 'No such usuario'
          })
        } else {
          usuario.activation = ''

          usuario.save().then((err, usuario) => {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating usuario.',
                error: err
              })
            }
            return res.json()
          })
        }
      })
    } else {
      return res.status(400).json({
        message: 'Error'
      })
    }
  },
  // /////////
  /**

     * usuarioController.remove()
  remove: function(req, res) {
     */
  remove: function (req, res) {
    var id = req.payload.id
    usuarioModel.findByIdAndRemove(id, function (err, usuario) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the usuario.',
          error: err
        })
      }
      return res.status(204).json()
    })
  }
}
