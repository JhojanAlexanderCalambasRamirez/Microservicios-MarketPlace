const model = require('../models/notificacionesModel');

module.exports = {
  async crear(req, res) {
    const id = await model.crear(req.body);
    res.status(201).json({ id, mensaje: 'Notificación creada' });
  },

  async listar(req, res) {
    const notificaciones = await model.obtenerTodas();
    res.json(notificaciones);
  },

  async porUsuario(req, res) {
    const notificaciones = await model.obtenerPorUsuario(req.params.id);
    res.json(notificaciones);
  },

  async marcarLeida(req, res) {
    await model.marcarLeida(req.params.id);
    res.json({ mensaje: 'Notificación marcada como leída' });
  },

  async eliminar(req, res) {
    await model.eliminar(req.params.id);
    res.status(204).send();
  }
};
