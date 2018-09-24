const { STRING, INTEGER, DOUBLE, JSONB } = require('sequelize');
const sequelize = require('./db');
var usuarioModel = require('./usuarioModel.js');

var proyectoSchema = sequelize.define(
  'proyecto',
  {
    usuario_id: {
      type: INTEGER,
      references: {
        model: usuarioModel,
        key: 'id',
      },
      required: true,
    },
    hash: {
      type: STRING,
      required: true,
      default: '-',
      unique: true,
    },
    nombre: {
      type: STRING,
      required: true,
      unique: true,
    },
    domicilio: {
      type: STRING,
      required: true,
    },
    telefono: {
      type: INTEGER,
      required: true,
    },
    email: {
      type: STRING,
      required: true,
    },
    monto: {
      type: DOUBLE,
      required: true,
    },
    montoSuperaMax: {
      type: DOUBLE,
      required: true,
    },
    sector: STRING,
    emprendedores: JSONB,
  },
  {
    hooks: {
      beforeCreate: instance => {
        instance.set(
          'hash',
          require('crypto')
            .randomBytes(64)
            .toString('hex'),
        );
      },
    },
  },
);

module.exports = proyectoSchema;
