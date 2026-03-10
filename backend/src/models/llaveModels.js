const pool = require('../config/db');
const { obtenerLlaves } = require('../controllers/llaveController');

const llaveModel = {
    async registrarLlave({ nombre_llave, zona_llave, cantidad_llave, estado }) {
        const query = `
            INSERT INTO llave (nombre_llave, zona_llave, cantidad_llave, estado)
            VALUES ( ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [nombre_llave, zona_llave, cantidad_llave, estado]);
        return result.insertId; // Regreso el Id de la nueva llave
    },

    async obtenerLlaves() {
        const query = 'SELECT * FROM llave';
        const [rows] = await pool.query(query);
        return rows;
    },
    //Obtener llaves por zona
    async obtenerLlavesPorZona(zona_llave) {
        const query = 'SELECT * FROM llave WHERE zona_llave = ?';
        const [rows] = await pool.query(query, [zona_llave]);
        return rows;
    },

    async actualizarLlave(id, { nombre_llave, zona_llave, cantidad_llave }) {
        const query = `
        UPDATE llave
        SET nombre_llave = ?, zona_llave = ?, cantidad_llave = ?
        WHERE id_llave = ?`;
        await pool.query(query, [nombre_llave, zona_llave, cantidad_llave, id]);
    },

    async suspenderLlave(id) {
        const query = `
        UPDATE llave
        SET estado = 'suspendida' WHERE id_llave = ?`;
        await pool.query(query, [id]);
    },

    async activarLlave(id) {
        const query = `
        UPDATE llave
        SET estado = 'disponible' WHERE id_llave = ?`;
        await pool.query(query, [id]);
    },

    async eliminarLlave(id) {
        const query = `DELETE FROM llave WHERE id_llave = ?`;
        await pool.query(query, [id]);
    }
};

module.exports = llaveModel;