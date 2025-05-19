const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = {
  async crearUsuario({ nombre, correo, contrasena, rol }) {
    const [res] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasena, rol]
    );
    return res.insertId;
  },

  async buscarPorCorreo(correo) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0];
  },

  async buscarPorId(id) {
    const [rows] = await db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

  async obtenerTodos() {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, rol, fechaRegistro FROM usuarios'
    );
    return rows;
  },

  async eliminar(id) {
    const [res] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return res.affectedRows;
  },

  async actualizar(id, { nombre, correo, rol }) {
    const [res] = await db.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
      [nombre, correo, rol, id]
    );
    return res.affectedRows;
  }
};
