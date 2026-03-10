const prestamoModel = require('../models/prestamoModel');

const prestamoController = {
    // Listar Prestamos
    async obtenerPrestamos(req, res) {
        try {
            const prestamos = await prestamoModel.obtenerPrestamos();
            return res.json(prestamos);
        } catch (error) {
            console.error('Error al listar los prestamos:', error);
            return res.status(500).json({ message: 'Error interno' });
        }
    },
    // Filtro de los prestamos 
    async obtenerPrestamosFiltrados(req, res) {
        const { filtro, mes, año } = req.query;
        try {
            const prestamos = await prestamoModel.obtenerPrestamosFiltrados(filtro, mes, año);
            return res.json(prestamos);
        } catch (error) {
            console.error("Error al listar préstamos filtrados:", error.message);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    // llaves prestadas 
    async obtenerLlavesPrestadas(req, res) {
        try {
            const llaves = await prestamoModel.obtenerLlavesPrestadas();
            return res.json(llaves);
        } catch (error) {
            console.error("Error al listar llaves prestadas:", error.message);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    // Registrar prestamo
    async registrarPrestamo(req, res) {
        const { id_llaves, solicitante, area_solicitante, num_empleado, id_responsable_presta, password, fecha, hora, tipo_prestamo } = req.body;
        try {
            // Validaciones comunes
            if (!id_llaves || id_llaves.length === 0 || !solicitante || !num_empleado || !area_solicitante || !fecha || !hora) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            // Validaciones específicas para inmediato
            if (tipo_prestamo === 'inmediato') {
                if (!id_responsable_presta) {
                    return res.status(401).json({ message: "Debe seleccionar el responsable para préstamos inmediatos" });
                }
                if (!password) {
                    return res.status(401).json({ message: "La contraseña es obligatoria para préstamos inmediatos" });
                }
            }

            // Crear préstamo en el modelo
            const id_prestamo = await prestamoModel.crearPrestamo({
                id_llaves,
                solicitante,
                area_solicitante,
                num_empleado,
                id_responsable_presta,
                password,
                fecha,
                hora,
                tipo_prestamo
            });

            // Mensaje dinámico según tipo
            return res.json({
                message: tipo_prestamo === 'anticipado'
                    ? 'Reserva registrada correctamente, llaves marcadas como anticipadas'
                    : 'Préstamo registrado correctamente, llaves marcadas como prestadas',
                id_prestamo
            });
        } catch (error) {
            console.error('Error al registrar préstamo:', error.message);
            return res.status(500).json({ message: error.message });
        }
    },
    // Activar prestamos
    async activarPrestamo(req, res) {
        const { id_responsable_presta, password } = req.body;
        const { id_prestamo } = req.params;

        try {
            await prestamoModel.activarPrestamo(id_prestamo, id_responsable_presta, password);
            return res.json({ message: "Préstamo activado correctamente, llaves entregadas" });
        } catch (error) {
            console.error("Error al activar préstamo:", error.message);
            return res.status(400).json({ message: error.message });
        }
    },
    // Devolver llaves
    async devolverLlave(req, res) {
        const { id_prestamo } = req.params;
        const { id_responsable_recibe, password, fecha, hora, id_llaves } = req.body;
        try {
            if (!id_responsable_recibe || !password || !fecha || !hora || !id_llaves || id_llaves.length === 0) {
                return res.status(400).json({ message: "Todos los campos son requeridos" });
            }

            const resultado = await prestamoModel.devolverLlaves(
                id_prestamo,
                id_responsable_recibe,
                password,
                fecha,
                hora,
                id_llaves
            );

            return res.json({
                message: resultado.message,
                estado_prestamo: resultado.estado_prestamo
            });
        } catch (error) {
            console.error('Error al devolver llaves:', error.message);
            return res.status(500).json({ message: error.message });
        }
    },
};

module.exports = prestamoController;
