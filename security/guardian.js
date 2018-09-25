const jwt = require('express-jwt');
const usuarioModel = require('../models/usuarioModel.js');

module.exports = options => [
  jwt({ secret: process.env.BCF, userProperty: 'payload' }),
  (req, res, next) => {
    if (
      !req.payload ||
      !(options.mailToken
        ? req.payload.uid
        : options.activationToken
          ? req.payload.acuid
          : req.payload.id)
    ) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      usuarioModel
        .findOne({
          where: {
            id: options.mailToken
              ? req.payload.uid
              : options.activationToken
                ? req.payload.acuid
                : req.payload.id,
          },
        })
        .then(
          usuario => {
            if (!usuario) {
              return res.status(401).json({
                message: 'Unauthorized',
              });
            } else if (!options.activationToken) {
              // if (!usuario.activation) {
              if (options.validateRole) {
                if (usuario.role !== options.validateRole) {
                  return res.status(401).json({
                    message: 'Unauthorized',
                  });
                }
                return next();
              } else if (options.mailToken) {
                if (req.payload.exp && new Date(req.payload.exp) < new Date()) {
                  return res.status(406).json({
                    message: 'Outdated token',
                  });
                }
                return next();
              }
              return next();

              // } else {
              //   return res.status(401).json({
              //     message: "Unauthorized"
              //   });
              // }
            }
            if (
              !req.payload.exp ||
              new Date(req.payload.exp) < new Date() ||
              !usuario.activation ||
              usuario.activation === '' ||
              usuario.activation !== req.headers.authorization.split('Bearer ')[1]
            ) {
              return res.status(401).json({
                message: 'Unauthorized',
              });
            }
            return next();
          },
          error => res.status(500).json({ message: 'Internal error' }),
        );
    }
  },
];
