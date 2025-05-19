const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function crearOrden({ idVendedor, idComprador, productos, total }) {
    const sql = `INSERT INTO ordenes (idVendedor, idComprador, productos, total) VALUES (?, ?, ?, ?)`;
    const values = [idVendedor, idComprador, JSON.stringify(productos), total];
    const [res] = await db.query(sql, values);
    return res.insertId;
}

async function obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM ordenes');
    return rows.map(row => ({
        ...row,
        productos: JSON.parse(row.productos)
    }));
}

async function obtenerPorComprador(idComprador) {
    const [rows] = await db.query('SELECT * FROM ordenes WHERE idComprador = ?', [idComprador]);
    return rows.map(row => ({
        ...row,
        productos: JSON.parse(row.productos)
    }));
}

async function actualizarEstado(id, nuevoEstado) {
    await db.query('UPDATE ordenes SET estado = ? WHERE id = ?', [nuevoEstado, id]);
}

async function eliminar(id) {
    await db.query('DELETE FROM ordenes WHERE id = ?', [id]);
}

async function obtenerEstadoYProductos(id) {
    const [rows] = await db.query('SELECT estado, productos FROM ordenes WHERE id = ?', [id]);
    if (rows.length === 0) return null;

    const { estado, productos } = rows[0];
    return {
        estado,
        productos: JSON.parse(productos)
    };
}

async function obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM ordenes WHERE id = ?', [id]);
    if (rows.length === 0) return null;

    const orden = rows[0];
    orden.productos = JSON.parse(orden.productos);

    if (!orden.idComprador || !orden.idVendedor) {
        console.error("Faltan datos clave en la orden:", orden);
    }

    return orden;
}

module.exports = {
    crearOrden,
    obtenerTodas,
    obtenerPorComprador,
    actualizarEstado,
    eliminar,
    obtenerEstadoYProductos,
    obtenerPorId 
};
