const model = require('../models/notificacionesModel');

async function crear(req, res) {
  try {
    const id = await model.crear(req.body);
    res.status(201).json({ id, mensaje: 'Notificación creada' });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ mensaje: 'Error interno al crear notificación' });
  }
}

async function listar(req, res) {
  try {
    const notificaciones = await model.obtenerTodas();
    res.json(notificaciones);
  } catch (error) {
    console.error('Error al listar notificaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
  }
}

async function porUsuario(req, res) {
  try {
    const notificaciones = await model.obtenerPorUsuario(req.params.id);
    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones del usuario' });
  }
}

async function marcarLeida(req, res) {
  try {
    await model.marcarLeida(req.params.id);
    res.json({ mensaje: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar como leída:', error);
    res.status(500).json({ mensaje: 'Error al marcar notificación' });
  }
}

async function eliminar(req, res) {
  try {
    await model.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ mensaje: 'Error al eliminar notificación' });
  }
}

module.exports = {
  crear,
  listar,
  porUsuario,
  marcarLeida,
  eliminar
};
