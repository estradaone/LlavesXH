const pool = require('../config/db');

const responsableModel = {
    // Obtener todos los responsables
    async obtenerResponsables() {
        const query = 'SELECT * FROM responsable_llaves';
        const [rows] = await pool.query(query);
        return rows;
    },

    // Registrar responsable
    async registrarResponsable({ nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password }) {
        const query = `
            INSERT INTO responsable_llaves (nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password]);
        return result.insertId;
    },

    // Actualizar responsable
    async actualizarResponsable(id, { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password }) {
        const query = `
            UPDATE responsable_llaves
            SET nombre_responsable = ?, apellido_p = ?, apellido_m = ?, num_empleado = ?, correo = ?, password = ?
            WHERE id_responsable = ?
        `;
        await pool.query(query, [nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password, id]);
    },

    // Eliminar responsable
    async eliminarResponsable(id) {
        const query = `DELETE FROM responsable_llaves WHERE id_responsable = ?`;
        await pool.query(query, [id]);
    },

    // Cambiar contraseña de responsable
    async cambiarPassword({ correo, actualPassword, nuevaPassword }) {
        // Buscar responsable por correo
        const [rows] = await pool.query(`SELECT * FROM responsable_llaves WHERE correo = ?`, [correo]);

        if (rows.length === 0) {
            return "NO_USER";
        }

        const responsable = rows[0];

        // Validar contraseña actual
        if (responsable.password !== actualPassword) {
            return "WRONG_PASSWORD";
        }

        // Actualizar contraseña
        await pool.query(`UPDATE responsable_llaves SET password = ? WHERE correo = ?`, [nuevaPassword, correo]);

        return "SUCCESS";
    }
};

module.exports = responsableModel;
