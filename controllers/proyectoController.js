var proyectoModel = require('../models/proyectoModel.js');

/**
 * proyectoController.js
 *
 * @description :: Server-side logic for managing proyectos.
 */
module.exports = {
  /**
   * proyectoController.list()
   */
  list: function(req, res) {
    proyectoModel.findAll().then(
      proyectos => {
        return res.json(proyectos);
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting proyecto.',
          error: error,
        });
      },
    );
  },

  /**
   * proyectoController.show()
   */
  show: function(req, res) {
    var id = req.params.id;
    proyectoModel.findOne({ where: { id: id } }).then(
      proyecto => {
        if (!proyecto) {
          return res.status(404).json({
            message: 'No such proyecto',
          });
        }
        return res.json(proyecto);
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting proyecto.',
          error: error,
        });
      },
    );
  },

  /**
   * proyectoController.create()
   */
  create: function(req, res) {
    var proyecto = proyectoModel.build({
      nombre: req.body.nombre,
      domicilio: req.body.domicilio,
      telefono: req.body.telefono,
      email: req.body.email,
      monto: req.body.monto,
      montoSuperaMax: req.body.montoSuperaMax,
      sector: req.body.sector,
      emprendedores: req.body.emprendedores,
    });

    proyecto.save().then(
      proyecto => {
        return res.status(201).json(proyecto);
      },
      error => {
        return res.status(500).json({
          message: 'Error when creating proyecto',
          error: error,
        });
      },
    );
  },

  /**
   * proyectoController.update()
   */
  update: function(req, res) {
    var id = req.params.id;
    proyectoModel.findOne({ where: { id: id } }).then(
      proyecto => {
        if (!proyecto) {
          return res.status(404).json({
            message: 'No such proyecto',
          });
        }

        proyecto.nombre = req.body.nombre ? req.body.nombre : proyecto.nombre;
        proyecto.domicilio = req.body.domicilio ? req.body.domicilio : proyecto.domicilio;
        proyecto.telefono = req.body.telefono ? req.body.telefono : proyecto.telefono;
        proyecto.email = req.body.email ? req.body.email : proyecto.email;
        proyecto.monto = req.body.monto ? req.body.monto : proyecto.monto;
        proyecto.montoSuperaMax = req.body.montoSuperaMax
          ? req.body.montoSuperaMax
          : proyecto.montoSuperaMax;
        proyecto.sector = req.body.sector ? req.body.sector : proyecto.sector;
        proyecto.emprendedores = req.body.emprendedores
          ? req.body.emprendedores
          : proyecto.emprendedores;

        proyecto.save().then(
          proyecto => {
            return res.json(proyecto);
          },
          error => {
            return res.status(500).json({
              message: 'Error when updating proyecto.',
              error: error,
            });
          },
        );
      },
      error => {
        return res.status(500).json({
          message: 'Error when getting proyecto',
          error: error,
        });
      },
    );
  },

  /**
   * proyectoController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    proyectoModel.destroy({ where: { id: id } }).then(
      () => {
        return res.status(204).json();
      },
      error => {
        return res.status(500).json({
          message: 'Error when deleting the proyecto.',
          error: error,
        });
      },
    );
  },
};
