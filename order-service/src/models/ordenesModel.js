// src/models/ordenesModel.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = {
  async crearOrden({ idVendedor, idComprador, productos, total }) {
    const sql = `INSERT INTO ordenes (idVendedor, idComprador, productos, total) VALUES (?, ?, ?, ?)`;
    const values = [idVendedor, idComprador, JSON.stringify(productos), total];
    const [res] = await db.query(sql, values);
    return res.insertId;
  },

  async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM ordenes');
    return rows.map(row => ({
      ...row,
      productos: JSON.parse(row.productos)
    }));
  },

  async obtenerPorComprador(idComprador) {
    const [rows] = await db.query('SELECT * FROM ordenes WHERE idComprador = ?', [idComprador]);
    return rows.map(row => ({
      ...row,
      productos: JSON.parse(row.productos)
    }));
  },

  async actualizarEstado(id, nuevoEstado) {
    await db.query('UPDATE ordenes SET estado = ? WHERE id = ?', [nuevoEstado, id]);
  },

  async eliminar(id) {
    await db.query('DELETE FROM ordenes WHERE id = ?', [id]);
  }
};
