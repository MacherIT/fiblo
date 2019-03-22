const { STRING, ARRAY } = require('sequelize');
const sequelize = require('./db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const usuarioSchema = sequelize.define('usuario', {
  email: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  nombre: {
    type: STRING,
    allowNull: false,
  },
  avatar: {
    type: STRING,
  },
  address: {
    type: ARRAY(STRING),
    default: [],
  },
  role: STRING,
  activation: STRING,
  hash: STRING,
});

usuarioSchema.prototype.setPassword = function(password) {
  this.hash = crypto.pbkdf2Sync(password, process.env.BCF, 1000, 64, 'sha1').toString('hex');
};

usuarioSchema.prototype.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, process.env.BCF, 1000, 64, 'sha1').toString('hex');
  return this.hash === hash;
};

usuarioSchema.prototype.generateJwt = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  // El rol se "encripta" como un base64 juntando el id de usuario y el email, después se "desencriptará" en el frontend para matchear con el valor del rol.
  return jwt.sign(
    Object.assign(
      {},
      {
        id: this.id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
      },
      this.role && {
        role: Buffer.from(`${this.id}${this.role}${this.email}`).toString('base64'),
      },
    ),
    process.env.BCF,
  );
};
usuarioSchema.prototype.generateMailToken = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  return jwt.sign(
    {
      uid: this.id,
      exp: parseInt(expiry.getTime()),
    },
    process.env.BCF,
  );
};

usuarioSchema.prototype.generateActivationToken = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  let token = jwt.sign(
    {
      acuid: this.id,
      exp: parseInt(expiry.getTime()),
    },
    process.env.BCF,
  );
  this.activation = token;
  return token;
};

module.exports = usuarioSchema;
