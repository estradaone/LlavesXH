const pool = require('../config/db');

const responsableModel = {
    // Obtener todos los responsables
    async obtenerResponsables () {
        const query = 'SELECT * FROM responsable_llaves';
        const [rows] = await pool.query(query);
        return rows;
    },

    // Registar responsable
    async registrarResponsable ({ nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password }) {
        const query = `
        INSERT INTO responsable_llaves (nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password]);
        return result.insertId; // Regreso el id del responsable
    },

    // Actualizar responsable 
    async actualizarResponsable ( id, { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password }) {
        const query = `
        UPDATE responsable_llaves
        SET nombre_responsable = ?, apellido_p = ?, apellido_m = ?, num_empleado = ?, correo = ?, password = ?
        WHERE id_responsable = ?
        `;
        await pool.query(query, [nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password, id]);
    },

    // Eliminar responsable
    async eliminarResponsable (id) {
        const query = `DELETE FROM responsable_llaves WHERE id_responsable = ?`;
        await pool.query(query, [id]);
    },
    
}

module.exports = responsableModel;