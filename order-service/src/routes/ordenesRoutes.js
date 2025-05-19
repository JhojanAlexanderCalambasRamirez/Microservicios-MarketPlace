const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordenesController');

router.post('/', ctrl.crear);
router.get('/', ctrl.listar);
router.get('/comprador/:id', ctrl.porComprador);
router.get('/estados', ctrl.listarEstados); // ✅ nuevo endpoint
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
