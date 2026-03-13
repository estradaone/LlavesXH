const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsableController');

// Obtener responsables
router.get('/', responsableController.obtenerResponsables);
// Registrar responsable
router.post('/', responsableController.registrarResponsable);
// Cambiar contraseña de responsable
router.put('/cambiar-password', responsableController.cambiarPassword);
// Actualizar responsable
router.put('/:id', responsableController.actualizarResponsable);
// Eliminar responsable
router.delete('/:id', responsableController.eliminarResponsable);

module.exports = router;
