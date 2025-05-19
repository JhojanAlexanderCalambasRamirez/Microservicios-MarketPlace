const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

console.log('CTRL:', ctrl);

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/validate-token', ctrl.validateToken);
router.get('/usuarios', ctrl.obtenerUsuarios); 
router.delete('/usuarios/:id', ctrl.eliminarUsuario);
router.put('/usuarios/:id', ctrl.editarUsuario);
router.get('/usuarios/:id', ctrl.obtenerUsuarioPorId);




module.exports = router;
