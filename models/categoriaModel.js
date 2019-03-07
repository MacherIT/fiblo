const { STRING } = require('sequelize');
const sequelize = require('./db');

var categoriaSchema = sequelize.define('categoria', {
  nombre: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  color: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  colorTexto: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = categoriaSchema;
