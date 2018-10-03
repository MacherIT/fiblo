const { STRING } = require('sequelize');
const sequelize = require('./db');

var categoriaSchema = sequelize.define('categoria', {
  nombre: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = categoriaSchema;
