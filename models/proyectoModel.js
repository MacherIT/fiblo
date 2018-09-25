const { STRING, INTEGER, DOUBLE, JSONB } = require('sequelize');
const sequelize = require('./db');
var usuarioModel = require('./usuarioModel.js');

var proyectoSchema = sequelize.define('proyecto', {
  usuario_id: {
    type: INTEGER,
    references: {
      model: usuarioModel,
      key: 'id',
    },
    allowNull: false,
  },
  hash: {
    type: STRING,
    allowNull: false,
    default: '-',
    unique: true,
  },
  nombre: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  domicilio: {
    type: STRING,
    allowNull: false,
  },
  telefono: {
    type: INTEGER,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  monto: {
    type: DOUBLE,
    allowNull: false,
  },
  montoSuperaMax: {
    type: DOUBLE,
    allowNull: false,
  },
  sector: STRING,
  emprendedores: JSONB,
});

module.exports = proyectoSchema;
