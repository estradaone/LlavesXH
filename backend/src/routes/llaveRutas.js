const express = require('express');
const router = express.Router();
const llaveController = require('../controllers/llaveController');

// Listar llaves 
router.get('/', llaveController.obtenerLlaves);
// Listar llaves por zona
router.get('/por-zona', llaveController.obtenerLlavesPorZona);
// Registrar llaves 
router.post('/', llaveController.registrarLlave);
// actualizar llave
router.put('/:id', llaveController.actualizarLlave);
// suspender llave 
router.put('/suspender/:id', llaveController.suspenderLlave);
// activar llave 
router.put('/activar/:id', llaveController.activarLlave);
// eliminar llave 
router.delete('/:id', llaveController.eliminarLlave);

module.exports = router;