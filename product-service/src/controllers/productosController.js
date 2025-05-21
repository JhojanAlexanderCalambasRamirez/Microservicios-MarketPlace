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

async function actualizarStock(req, res) {
  const id = req.params.id;
  const { cantidadVendida } = req.body;

  if (!cantidadVendida || isNaN(cantidadVendida)) {
    return res.status(400).json({ mensaje: 'Cantidad vendida inválida.' });
  }

  try {
    const producto = await model.obtenerPorId(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });

    if (producto.stock < cantidadVendida) {
      return res.status(400).json({ mensaje: 'Stock insuficiente.' });
    }

    const nuevoStock = producto.stock - cantidadVendida;
    await model.actualizarStock(id, nuevoStock);
    res.json({ mensaje: 'Stock actualizado', stockRestante: nuevoStock });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar el stock.' });
  }
}

async function incrementarStock(req, res) {
  const id = req.params.id;
  const { cantidad } = req.body;

  if (!cantidad || isNaN(cantidad)) {
    return res.status(400).json({ mensaje: 'Cantidad inválida.' });
  }

  try {
    const producto = await model.obtenerPorId(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });

    const nuevoStock = producto.stock + cantidad;
    await model.actualizarStock(id, nuevoStock);
    res.json({ mensaje: 'Stock incrementado', stockNuevo: nuevoStock });
  } catch (error) {
    console.error('Error al incrementar stock:', error);
    res.status(500).json({ mensaje: 'Error interno al incrementar el stock.' });
  }
}

module.exports = {
  listar,
  ver,
  crear,
  actualizar,
  eliminar,
  actualizarStock,
  incrementarStock
};
