var usuarioModel = require('./usuarioModel.js');
var proyectoModel = require('./proyectoModel.js');

proyectoModel.belongsTo(usuarioModel, { foreignKey: 'usuario_id', as: 'usuario' });

usuarioModel.hasMany(proyectoModel, {
  foreignKey: 'usuario_id',
  as: 'proyectos',
});
