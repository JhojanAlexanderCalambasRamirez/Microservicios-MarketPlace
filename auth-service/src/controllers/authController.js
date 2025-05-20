const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const model = require('../models/usuarioModel');

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

async function register(req, res) {
  try {
    const { nombre, correo, contrasena, rol } = req.body;
    const existente = await model.buscarPorCorreo(correo);
    if (existente) return res.status(400).json({ mensaje: 'El correo ya está registrado.' });

    const hash = await bcrypt.hash(contrasena, 10);
    const id = await model.crearUsuario({ nombre, correo, contrasena: hash, rol });

    // Enviar notificación al nuevo usuario
    await axios.post('http://localhost:3004/notificaciones', {
      idUsuario: id,
      mensaje: `¡Bienvenido ${nombre}! Tu cuenta ha sido creada exitosamente.`
    });

    res.status(201).json({ id, mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error interno en el registro' });
  }
}

async function login(req, res) {
  const { correo, contrasena } = req.body;

  const usuario = await model.buscarPorCorreo(correo);
  if (!usuario) return res.status(404).json({ mensaje: 'Correo no registrado.' });

  const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!coincide) return res.status(401).json({ mensaje: 'Contrasena incorrecta.' });

  const token = generarToken(usuario);
  res.json({ token, rol: usuario.rol, id: usuario.id });
}

async function validateToken(req, res) {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new Error();
    const token = auth.split(' ')[1];
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valido: true, datos: verificado });
  } catch {
    res.status(401).json({ valido: false });
  }
}

async function obtenerUsuarios(req, res) {
  const usuarios = await model.obtenerTodos();
  res.json(usuarios);
}

async function obtenerUsuarioPorId(req, res) {
  const usuario = await model.buscarPorId(req.params.id);
  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
  res.json(usuario);
}

async function eliminarUsuario(req, res) {
  const id = req.params.id;
  const resultado = await model.eliminar(id);
  if (resultado > 0) {
    res.json({ mensaje: "Usuario eliminado correctamente." });
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado." });
  }
}

async function editarUsuario(req, res) {
  const id = req.params.id;
  const { nombre, correo, rol } = req.body;
  const resultado = await model.actualizar(id, { nombre, correo, rol });
  if (resultado > 0) {
    res.json({ mensaje: "Usuario actualizado correctamente." });
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado o sin cambios." });
  }
}

module.exports = {
  register,
  login,
  validateToken,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuario,
  editarUsuario
};
