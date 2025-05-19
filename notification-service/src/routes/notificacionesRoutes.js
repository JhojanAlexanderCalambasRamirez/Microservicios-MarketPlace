const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificacionesController');

router.post('/', ctrl.crear);
router.get('/', ctrl.listar);
router.get('/usuario/:id', ctrl.porUsuario);
router.put('/:id', ctrl.marcarLeida);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
