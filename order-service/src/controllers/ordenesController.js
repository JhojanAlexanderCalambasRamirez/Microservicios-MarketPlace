const jwt = require('jsonwebtoken');
const axios = require('axios');
const model = require('../models/ordenesModel');

const ESTADOS_VALIDOS = ['pendiente', 'enviado', 'entregado', 'cancelado'];

async function crear(req, res) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Token requerido o malformado' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idComprador = decoded.id;

    const { productos } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Lista de productos vacía' });
    }

    const ordenesPorVendedor = [];

    for (const prod of productos) {
      const response = await axios.get(`http://localhost:3001/productos/${prod.id}`);
      const productoBD = response.data;

      if (!productoBD) {
        return res.status(404).json({ mensaje: `Producto con ID ${prod.id} no encontrado` });
      }

      if (productoBD.stock < prod.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${productoBD.nombre}` });
      }

      prod.idVendedor = productoBD.idVendedor;
      prod.precio = productoBD.precio;

      if (!ordenesPorVendedor[prod.idVendedor]) {
        ordenesPorVendedor[prod.idVendedor] = [];
      }

      ordenesPorVendedor[prod.idVendedor].push(prod);
    }

    const ids = [];

    for (const [idVendedor, items] of Object.entries(ordenesPorVendedor)) {
      const total = items.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

      const id = await model.crearOrden({
        idVendedor: parseInt(idVendedor),
        idComprador,
        productos: items,
        total
      });

      ids.push(id);
    }

    res.status(201).json({ mensaje: 'Ordenes generadas correctamente', ordenesCreadas: ids });

  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ mensaje: 'Error interno al generar la orden' });
  }
}

async function listar(req, res) {
  try {
    const ordenes = await model.obtenerTodas();
    res.json(ordenes);
  } catch (error) {
    console.error('Error al listar órdenes:', error);
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
  }
}

async function porComprador(req, res) {
  try {
    const ordenes = await model.obtenerPorComprador(req.params.id);
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes del comprador:', error);
    res.status(500).json({ mensaje: 'Error al obtener órdenes del comprador' });
  }
}

async function actualizar(req, res) {
  try {
    const nuevoEstado = req.body.estado;
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    await model.actualizarEstado(req.params.id, nuevoEstado);
    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado' });
  }
}

async function eliminar(req, res) {
  try {
    await model.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
  }
}

async function listarEstados(req, res) {
  res.json({ estados: ESTADOS_VALIDOS });
}

module.exports = {
  crear,
  listar,
  porComprador,
  actualizar,
  eliminar,
  listarEstados
};
