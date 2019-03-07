var express = require('express');
var router = express.Router();
var proyectoController = require('../controllers/proyectoController.js');
var guardian = require('../security/guardian');

/*
 * GET
 */
router.get('/', proyectoController.list);

router.get('/mine', guardian({}), proyectoController.mine);

/*
 * GET
 */
router.get('/:id', proyectoController.show);

/*
 * POST
 */
router.post('/', guardian({}), proyectoController.create);

/*
 * PUT
 */
router.put('/:id', guardian({}), proyectoController.update);

/*
 * DELETE
 */
router.delete('/:id', guardian({}), proyectoController.remove);

module.exports = router;
