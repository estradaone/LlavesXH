const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsableController');
const { route } = require('./llaveRutas');

//Obtener responsables
router.get('/', responsableController.obtenerResponsables);
// Registrar responsable
router.post('/', responsableController.registrarResponsable);
// Actualizar responsable
router.put('/:id', responsableController.actualizarResponsable);
// Elliminar responsable
router.delete('/:id', responsableController.eliminarResponsable);

module.exports = router;