var usuarioModel = require('./usuarioModel.js');
var proyectoModel = require('./proyectoModel.js');
var categoriaModel = require('./categoriaModel.js');

proyectoModel.belongsTo(usuarioModel, { foreignKey: 'usuario_id', as: 'usuario' });
proyectoModel.belongsTo(categoriaModel, { foreignKey: 'categoria_id', as: 'categoria' });

usuarioModel.hasMany(proyectoModel, {
  foreignKey: 'usuario_id',
  as: 'proyectos',
});
