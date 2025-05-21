const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordenesController');

// Crear una nueva orden (por comprador)
router.post('/', ctrl.crear);

// Obtener todas las órdenes (para el admin o testing)
router.get('/', ctrl.listar);

// Obtener órdenes por comprador
router.get('/comprador/:id', ctrl.porComprador);

// Obtener lista de estados válidos
router.get('/estados', ctrl.listarEstados);

// Actualizar el estado de una orden (aceptar, rechazar, etc.)
router.put('/:id', ctrl.actualizarEstado);  // 🔄 CAMBIADO

// Eliminar una orden (opcional)
router.delete('/:id', ctrl.eliminar);

// Obtener factura por orden
router.get('/:id/factura', ctrl.generarFactura);

module.exports = router;
