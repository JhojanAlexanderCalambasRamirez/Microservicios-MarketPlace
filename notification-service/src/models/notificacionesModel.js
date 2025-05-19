const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = {
  async crear(notificacion) {
    const sql = `INSERT INTO notificaciones (idUsuario, mensaje) VALUES (?, ?)`;
    const values = [notificacion.idUsuario, notificacion.mensaje];
    const [res] = await db.query(sql, values);
    return res.insertId;
  },

  async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM notificaciones');
    return rows;
  },

  async obtenerPorUsuario(idUsuario) {
    const [rows] = await db.query('SELECT * FROM notificaciones WHERE idUsuario = ?', [idUsuario]);
    return rows;
  },

  async marcarLeida(id) {
    await db.query('UPDATE notificaciones SET leido = TRUE WHERE id = ?', [id]);
  },

  async eliminar(id) {
    await db.query('DELETE FROM notificaciones WHERE id = ?', [id]);
  }
};
