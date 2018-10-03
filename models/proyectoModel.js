const { STRING, INTEGER, DOUBLE, JSONB } = require('sequelize');
const sequelize = require('./db');
var usuarioModel = require('./usuarioModel.js');
var categoriaModel = require('./categoriaModel.js');

var proyectoSchema = sequelize.define('proyecto', {
  usuario_id: {
    type: INTEGER,
    references: {
      model: usuarioModel,
      key: 'id',
    },
    allowNull: false,
  },
  categoria_id: {
    type: INTEGER,
    references: {
      model: categoriaModel,
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
  ciudad: {
    type: JSONB,
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
  emprendedores: JSONB,
});

module.exports = proyectoSchema;
