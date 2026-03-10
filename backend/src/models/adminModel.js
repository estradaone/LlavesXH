const pool = require('../config/db'); // conexión MySQL

const adminModel = {
    // Buscar admin por correo
    async findByEmail(correo) {
        const query = 'SELECT * FROM admin WHERE correo = ?';
        const [rows] = await pool.query(query, [correo]);
        return rows;
    },

    // Buscar admin por ID (útil para verificar token)
    async findById(id_admin) {
        const query = 'SELECT * FROM admin WHERE id_admin = ?';
        const [rows] = await pool.query(query, [id_admin]);
        return rows;
    },

    // Registrar un nuevo admin
    async registrarAdmin({ correo, password }) {
        const query = `
            INSERT INTO admin (correo, password)
            VALUES (?, ?)
        `;
        const [result] = await pool.query(query, [correo, password]);
        return result.insertId; // Regresa el id del nuevo admin
    }
};

module.exports = adminModel;
