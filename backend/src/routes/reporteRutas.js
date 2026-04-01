const express = require("express");
const router = express.Router();
const ReporteController = require("../controllers/reporteController");

router.get("/excel", ReporteController.generarExcel);
router.get("/pdf", ReporteController.generarPDF);

module.exports = router;
