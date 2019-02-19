var proyectoModel = require('../models/proyectoModel.js');
var categoriaModel = require('../models/categoriaModel.js');
const { create } = require('./fibloContract');

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
    proyectoModel
      .findAll({
        include: [
          {
            model: categoriaModel,
            as: 'categoria',
          },
        ],
      })
      .then(
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
    proyectoModel
      .findOne({
        where: { id: id },
        include: [
          {
            model: categoriaModel,
            as: 'categoria',
          },
        ],
      })
      .then(
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
    if (req.payload && req.payload.id) {
      var proyecto = proyectoModel.build({
        categoria_id: req.body.categoria_id,
        usuario_id: req.payload.id,
        address: req.body.address,
        ciudad: req.body.ciudad,
        nombre: req.body.nombre,
        domicilio: req.body.domicilio,
        telefono: req.body.telefono,
        email: req.body.email,
        monto: req.body.monto,
        montoSuperaMax: req.body.montoSuperaMax,
        cantAcciones: req.body.cantAcciones,
        sector: req.body.sector,
        emprendedores: req.body.emprendedores,
      });

      proyecto.save().then(
        proyecto => {
          return res.status(201).json(proyecto);
        },
        error => {
          console.log(error);
          return res.status(500).json({
            message: 'Error when creating proyecto',
            error: error,
          });
        },
      );
    } else {
      return res.status(500).json({
        message: 'Error when creating proyecto',
      });
    }
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

        proyecto.categoria_id = req.body.categoria_id
          ? req.body.categoria_id
          : proyecto.categoria_id;
        proyecto.nombre = req.body.nombre ? req.body.nombre : proyecto.nombre;
        proyecto.ciudad = req.body.ciudad ? req.body.ciudad : proyecto.ciudad;
        proyecto.domicilio = req.body.domicilio ? req.body.domicilio : proyecto.domicilio;
        proyecto.telefono = req.body.telefono ? req.body.telefono : proyecto.telefono;
        proyecto.email = req.body.email ? req.body.email : proyecto.email;
        proyecto.monto = req.body.monto ? req.body.monto : proyecto.monto;
        proyecto.montoSuperaMax = req.body.montoSuperaMax
          ? req.body.montoSuperaMax
          : proyecto.montoSuperaMax;
        proyecto.cantAcciones = req.body.cantAcciones
          ? req.body.cantAcciones
          : proyecto.cantAcciones;
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
