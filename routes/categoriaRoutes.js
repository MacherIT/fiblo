var express = require('express');
var router = express.Router();
var categoriaController = require('../controllers/categoriaController.js');
var guardian = require('../security/guardian');

/*
 * GET
 */
router.get('/', categoriaController.list);

/*
 * GET
 */
router.get('/:id', categoriaController.show);

/*
 * POST
 */
router.post('/', guardian({}), categoriaController.create);

/*
 * PUT
 */
router.put('/:id', guardian({}), categoriaController.update);

/*
 * DELETE
 */
router.delete('/:id', guardian({}), categoriaController.remove);

module.exports = router;
