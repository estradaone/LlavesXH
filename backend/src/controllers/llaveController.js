const llaveModel = require('../models/llaveModels');

const llaveController = {
    async registrarLlave(req, res) {
        const { nombre_llave, zona_llave, cantidad_llave, estado } = req.body;

        try {
            if (!nombre_llave || !zona_llave || !cantidad_llave) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            const id = await llaveModel.registrarLlave({ nombre_llave, zona_llave, cantidad_llave, estado });
            return res.json({ message: 'Llave registrada correctamente', id_llave: id });
        } catch (error) {
            console.error('Error al registrar llave:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async obtenerLlaves(req, res) {
        try {
            const llaves = await llaveModel.obtenerLlaves();
            return res.json(llaves);
        } catch (error) {
            console.error('Error al obtener las llaves:', error);
            return res.status(500).json({ message: 'Error en servidor' });
        }
    },
    //Obtener llaves por zonas
    async obtenerLlavesPorZona(req, res) {
        const { zona } = req.query; // se recibe como query param
        try {
            if (!zona) {
                return res.status(400).json({ message: "Zona requerida" });
            }
            const llaves = await llaveModel.obtenerLlavesPorZona(zona);
            return res.json(llaves);
        } catch (error) {
            console.error("Error al obtener llaves por zona:", error);
            return res.status(500).json({ message: "Error en servidor" });
        }
    },

    async actualizarLlave(req, res) {
        const { id } = req.params;
        const { nombre_llave, zona_llave, cantidad_llave } = req.body;
        try {
            await llaveModel.actualizarLlave(id, { nombre_llave, zona_llave, cantidad_llave });
            res.json({ message: "Llave actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ message: " Error al actualizar llave" });
        }
    },

    async suspenderLlave(req, res) {
        const { id } = req.params;
        try {
            await llaveModel.suspenderLlave(id);
            res.json({ message: "Llave suspendida " });
        } catch (error) {
            res.status(500).json({ message: "Error al suspender llave " });
        }
    },

    async activarLlave(req, res) {
        const { id } = req.params;
        try {
            await llaveModel.activarLlave(id);
            res.json({ message: "Llave activa" });
        } catch (error) {
            res.status(500).json({ message: "Error al activar llave" })
        }
    },

    async eliminarLlave(req, res) {
        const { id } = req.params;
        try {
            await llaveModel.eliminarLlave(id);
            res.json({ message: "Llave eliminada" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar llave" });
        }
    },

};

module.exports = llaveController;