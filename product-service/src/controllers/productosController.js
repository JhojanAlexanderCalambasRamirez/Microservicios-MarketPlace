const model = require('../models/productosModel');

async function listar(req, res) {
  const productos = await model.obtenerTodos();
  res.json(productos);
}

async function ver(req, res) {
  const producto = await model.obtenerPorId(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
}

async function crear(req, res) {
  const id = await model.crear(req.body);
  res.status(201).json({ id });
}

async function actualizar(req, res) {
  await model.actualizar(req.params.id, req.body);
  res.status(200).json({ mensaje: 'Producto actualizado' });
}

async function eliminar(req, res) {
  await model.eliminar(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar,
  ver,
  crear,
  actualizar,
  eliminar
};
