const responsableModel = require('../models/responsableModel');

const responsableController = {
    // Obtener los responsables
    async obtenerResponsables(req, res) {
        try {
            const responsables = await responsableModel.obtenerResponsables();
            return res.json(responsables);
        } catch (error) {
            console.error('Error al obtener responsables:', error);
            return res.status(500).json({ message: 'Error del servidor' });
        }
    },

    // Registrar responsable
    async registrarResponsable(req, res) {
        const { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password } = req.body;
        try {
            if (!nombre_responsable || !apellido_p || !apellido_m || !num_empleado || !correo || !password) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            const id = await responsableModel.registrarResponsable({ nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password });
            return res.json({ message: 'Responsable registrado correctamente', id_responsable: id });
        } catch (error) {
            console.error('Error al registrar responsable:', error);
            return res.status(500).json({ message: 'Error interno' });
        }
    },

    // Actualizar datos responsable
    async actualizarResponsable(req, res) {
        const { id } = req.params;
        const { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password } = req.body;
        try {
            await responsableModel.actualizarResponsable(id, { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password });
            res.json({ message: "Responsable actualizado correctamente" });
        } catch (error) {
            console.error('Error al actualizar responsable:', error);
            res.status(500).json({ message: 'Error interno' });
        }
    },

    // Eliminar responsable
    async eliminarResponsable(req, res) {
        const { id } = req.params;
        try {
            await responsableModel.eliminarResponsable(id);
            res.json({ message: "Responsable eliminado" });
        } catch (error) {
            console.error('Error al eliminar responsable:', error);
            res.status(500).json({ message: "Error interno" });
        }
    },

    // Cambiar contraseña de responsable
    async cambiarPassword(req, res) {
        const { correo, actualPassword, nuevaPassword } = req.body;
        try {
            if (!correo || !actualPassword || !nuevaPassword) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            const result = await responsableModel.cambiarPassword({ correo, actualPassword, nuevaPassword });

            if (result === "NO_USER") {
                return res.status(404).json({ message: "Correo no encontrado" });
            }
            if (result === "WRONG_PASSWORD") {
                return res.status(401).json({ message: "Contraseña actual incorrecta" });
            }

            return res.json({ message: "Contraseña cambiada correctamente" });
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            return res.status(500).json({ message: "Error en la base de datos o servidor" });
        }
    }
};

module.exports = responsableController;
