const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();


const db = mysql.createPool({
  host: process.env.DB_HOST || 'tienda-uao.com',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'product_service',
  port: process.env.DB_PORT || 3306,
});

async function obtenerTodos() {
  const [rows] = await db.query('SELECT * FROM productos');
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
}

async function crear(producto) {
  const sql = `
    INSERT INTO productos (nombre, descripcion, precio, stock, idVendedor, urlImagen)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    producto.nombre,
    producto.descripcion,
    producto.precio,
    producto.stock,
    producto.idVendedor,
    producto.urlImagen
  ];
  const [res] = await db.query(sql, values);
  return res.insertId;
}

async function actualizar(id, producto) {
  const sql = `
    UPDATE productos
    SET nombre = ?, descripcion = ?, precio = ?, stock = ?, urlImagen = ?
    WHERE id = ?
  `;
  const values = [
    producto.nombre,
    producto.descripcion,
    producto.precio,
    producto.stock,
    producto.urlImagen,
    id
  ];
  await db.query(sql, values);
}

async function eliminar(id) {
  await db.query('DELETE FROM productos WHERE id = ?', [id]);
}

async function actualizarStock(idProducto, cantidadComprada) {
  const producto = await obtenerPorId(idProducto);
  if (!producto) {
    throw new Error(`Producto con ID ${idProducto} no encontrado`);
  }

  if (producto.stock < cantidadComprada) {
    throw new Error(`Stock insuficiente para el producto "${producto.nombre}"`);
  }

  const nuevoStock = producto.stock - cantidadComprada;
  await db.query('UPDATE productos SET stock = ? WHERE id = ?', [nuevoStock, idProducto]);
}

// ✅ NUEVO: Descontar múltiples productos según cantidades
async function descontarStockLote(productos) {
  for (const p of productos) {
    await actualizarStock(p.id, p.cantidad);
  }
}

// ✅ NUEVO: Reponer múltiples productos (si se cancela la orden)
async function reponerStockLote(productos) {
  for (const p of productos) {
    const producto = await obtenerPorId(p.id);
    if (producto) {
      const nuevoStock = producto.stock + p.cantidad;
      await db.query('UPDATE productos SET stock = ? WHERE id = ?', [nuevoStock, p.id]);
    }
  }
}

async function actualizarStock(id, nuevoStock) {
  await db.query('UPDATE productos SET stock = ? WHERE id = ?', [nuevoStock, id]);
}

async function incrementarStock(idProducto, cantidad) {
  try {
    await axios.put(`http://tienda-uao.com:3001/productos/${idProducto}/incrementar`, {
      cantidad
    });
  } catch (error) {
    console.error(`[ERROR] No se pudo incrementar el stock del producto ${idProducto}:`, error);
    throw error;
  }
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  actualizarStock,
  descontarStockLote,
  reponerStockLote,
  incrementarStock
};
