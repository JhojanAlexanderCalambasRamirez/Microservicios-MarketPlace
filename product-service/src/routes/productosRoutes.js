const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productosController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.ver);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

// 👇 rutas adicionales
router.put('/:id/stock', ctrl.actualizarStock);      // para descontar
router.put('/:id/incrementar', ctrl.incrementarStock); // para reponer

module.exports = router;
