var categoriaModel = require('../models/categoriaModel.js');

/**
 * categoriaController.js
 *
 * @description :: Server-side logic for managing categorias.
 */
module.exports = {
  /**
   * categoriaController.list()
   */
  list: function(req, res) {
    categoriaModel.findAll().then(
      categorias => {
        return res.json(categorias);
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting categoria.',
          error: error,
        });
      },
    );
  },

  /**
   * categoriaController.show()
   */
  show: function(req, res) {
    var id = req.params.id;
    categoriaModel.findOne({ where: { id: id } }).then(
      categoria => {
        if (!categoria) {
          return res.status(404).json({
            message: 'No such categoria',
          });
        }
        return res.json(categoria);
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting categoria.',
          error: error,
        });
      },
    );
  },

  /**
   * categoriaController.create()
   */
  create: function(req, res) {
    var categoria = categoriaModel.build({
      nombre: req.body.nombre,
      color: req.body.color,
      colorTexto: req.body.colorTexto,
    });

    categoria.save().then(
      categoria => {
        return res.status(201).json(categoria);
      },
      error => {
        return res.status(500).json({
          message: 'Error when creating categoria',
          error: error,
        });
      },
    );
  },

  /**
   * categoriaController.update()
   */
  update: function(req, res) {
    var id = req.params.id;
    categoriaModel.findOne({ where: { id: id } }).then(
      categoria => {
        if (!categoria) {
          return res.status(404).json({
            message: 'No such categoria',
          });
        }

        categoria.nombre = req.body.nombre ? req.body.nombre : categoria.nombre;
        categoria.color = req.body.color ? req.body.color : categoria.color;
        categoria.colorTexto = req.body.colorTexto ? req.body.colorTexto : categoria.colorTexto;

        categoria.save().then(
          categoria => {
            return res.json(categoria);
          },
          error => {
            return res.status(500).json({
              message: 'Error when updating categoria.',
              error: error,
            });
          },
        );
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting categoria',
          error: error,
        });
      },
    );
  },

  /**
   * categoriaController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    categoriaModel.destroy({ where: { id: id } }).then(
      () => {
        return res.status(204).json();
      },
      error => {
        return res.status(500).json({
          message: 'Error when deleting the categoria.',
          error: error,
        });
      },
    );
  },
};
