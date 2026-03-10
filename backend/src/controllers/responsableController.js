const responsableModel = require('../models/responsableModel');

const responsableController = {
    // Obtener los responsables
    async obtenerResponsables (req, res) {
        try {
                const responsable = await responsableModel.obtenerResponsables();
                return res.json(responsable);
        } catch (error) {
            console.error('Error al obtener responsable:', error);
            return res.status(500).json({ message: 'Error del servidor'});
        }
    },

    //Registrar responsable
    async registrarResponsable (req, res) {
        const { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password } = req.body;
        try {
            if(!nombre_responsable || !apellido_p || !apellido_m || !num_empleado || !correo || !password ) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            const id = await responsableModel.registrarResponsable({ nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password });
            return res.json({ message: 'Responsable registrado correctamente', id_responsable: id});
        } catch (error) {
            console.error('Error al registrar responsable:', error);
            return res.status(500).json({ message: 'Error interno'});
        }
    },

    // Actualizar datos responsable
    async actualizarResponsable ( req, res) {
        const { id } = req.params;
        const { nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password } = req.body;
        try {
            await responsableModel.actualizarResponsable(id, {nombre_responsable, apellido_p, apellido_m, num_empleado, correo, password});
            res.json({ message: "Responsable actualizado correctamente "});
        } catch (error) {
            res.status(500).json({ message: 'Error interno'});
        }
    },

    //Eliminar responsable
    async eliminarResponsable (req, res) {
        const { id } = req.params;
        try {
            await responsableModel.eliminarResponsable(id);
            res.json({ message: "Responsable eliminado"});
        } catch (error) {
            res.status(500).json({ message: "Error interno"});
        }
    },
}

module.exports = responsableController;