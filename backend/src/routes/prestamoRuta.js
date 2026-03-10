const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
// Listar prestamos 
router.get('/prestamos', prestamoController.obtenerPrestamos);
// llaves prestadas 
router.get('/prestamos/llaves-prestadas', prestamoController.obtenerLlavesPrestadas);
// filtro de los prestamos 
router.get('/prestamos/filtrados', prestamoController.obtenerPrestamosFiltrados);
//Registrar prestamo
router.post('/prestamos', prestamoController.registrarPrestamo);
//Activar prestamo anticipado
router.put('/prestamos/:id_prestamo/activar', prestamoController.activarPrestamo)
//Devolver llave
router.put('/prestamos/:id_prestamo/devolver', prestamoController.devolverLlave);

module.exports = router;