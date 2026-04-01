const ExcelJS = require("exceljs");
const path = require("path")
const puppeteer = require("puppeteer");
const ReporteModel = require("../models/reporteModel");

class ReporteController {
    static async generarExcel(req, res) {
        try {
            const { filtro = "todo", mes = null, año = null } = req.query;
            const rows = await ReporteModel.obtenerPrestamosFiltrados(filtro, mes, año);

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Historial Prestamos");

            sheet.columns = [
                { header: "ID", key: "id_prestamo", width: 10 },
                { header: "Llaves", key: "llaves", width: 30 },
                { header: "Zona", key: "zonas", width: 30 },
                { header: "Solicitante", key: "solicitante", width: 20 },
                { header: "Área", key: "area_solicitante", width: 20 },
                { header: "Num Colaborador", key: "num_empleado", width: 20 },
                { header: "Responsable Presta", key: "responsable_presta", width: 25 },
                { header: "Responsable Recibe", key: "responsable_recibe", width: 25 },
                { header: "Fecha Préstamo", key: "fecha_prestamo", width: 15 },
                { header: "Hora Préstamo", key: "hora_prestamo", width: 15 },
                { header: "Fecha Devolución", key: "fecha_devolucion", width: 15 },
                { header: "Hora Devolución", key: "hora_devolucion", width: 15 },
                { header: "Estado", key: "estado_prestamo", width: 15 },
            ];

            rows.forEach(r => {
                sheet.addRow({
                    id_prestamo: r.id_prestamo,
                    llaves: r.llaves.map(l => l.nombre_llave).join(", "),
                    zonas: r.llaves.map(l => l.zona_llave).join(", "),
                    solicitante: r.solicitante,
                    area_solicitante: r.area_solicitante,
                    num_empleado: r.num_empleado,
                    responsable_presta: r.responsable_presta || "-",
                    responsable_recibe: r.responsable_recibe || "-",
                    fecha_prestamo: r.fecha_prestamo,
                    hora_prestamo: r.hora_prestamo,
                    fecha_devolucion: r.fecha_devolucion || "-",
                    hora_devolucion: r.hora_devolucion || "-",
                    estado_prestamo: r.estado_prestamo,
                });
            });

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=prestamos.xlsx");

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Error Excel:", error);
            res.status(500).json({ message: "Error al generar Excel" });
        }
    }

    static async generarPDF(req, res) {
        try {
            const { filtro = "todo", mes = null, año = null } = req.query;
            const rows = await ReporteModel.obtenerPrestamosFiltrados(filtro, mes, año);

            // Rutas locales a los logos
            const logoIzq = "http://localhost:4000/public/images/logoXH.png";
            const logoDer = "http://localhost:4000/public/images/xcaret.png";

            // Generar HTML dinámico con la tabla
            const html = `
            <html>
            <head>
                <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #4a90e2; color: white; padding: 8px; text-align: center; }
                td { border: 1px solid #ccc; padding: 6px; text-align: center; }
                tr:nth-child(even) { background: #f9f9f9; }
                .llaves-zonas { text-align: left; }
                .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
                .header img { height:60px; }
                .header h1 { flex-grow:1; text-align:center; color:#333; }
                .page-number:before { content: counter(page, decimal); }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="http://localhost:4000/public/images/xcaret.png" style="height:60px;">
                    <h1>Historial de prestamos</h1>
                    <img src="http://localhost:4000/public/images/logoXH.png" style="height:60px;">
                </div>

                <table>
                <thead>
                    <tr>
                    <th>Llaves</th>
                    <th>Zona</th>
                    <th>Solicitante</th>
                    <th>Área</th>
                    <th>Num Colaborador</th>
                    <th>Quién Presta</th>
                    <th>Quién Recibe</th>
                    <th>Fecha Préstamo</th>
                    <th>Hora Préstamo</th>
                    <th>Fecha Devolución</th>
                    <th>Hora Devolución</th>
                    <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                    ${r.llaves.map(l => `
                        <tr>
                        <td class="llaves-zonas">${l.nombre_llave}</td>
                        <td class="llaves-zonas">${l.zona_llave}</td>
                        <td>${r.solicitante}</td>
                        <td>${r.area_solicitante}</td>
                        <td>${r.num_empleado}</td>
                        <td>${r.responsable_presta || "-"}</td>
                        <td>${r.responsable_recibe || "-"}</td>
                        <td>${r.fecha_prestamo ? new Date(r.fecha_prestamo).toLocaleDateString("es-MX") : "-"}</td>
                        <td>${r.hora_prestamo || "-"}</td>
                        <td>${r.fecha_devolucion ? new Date(r.fecha_devolucion).toLocaleDateString("es-MX") : "-"}</td>
                        <td>${r.hora_devolucion || "-"}</td>
                        <td>${r.estado_prestamo}</td>
                        </tr>
                    `).join("")}
                    `).join("")}
                </tbody>
                </table>
            </body>
            </html>
        `;

            // Usar Puppeteer para convertir HTML a PDF
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                displayHeaderFooter: true,
                margin: { top: "80px", right: "20px", bottom: "50px", left: "20px" },
                headerTemplate: "<div></div>", // sin header
                footerTemplate: `
                <div style="font-size:10px; text-align:center; width:100%;">
                Reporte generado el ${new Date().toLocaleString("es-MX")} — Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                </div>
            `
            });


            await browser.close();

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=prestamos.pdf");
            res.end(pdfBuffer);
        } catch (error) {
            console.error("Error PDF Puppeteer:", error);
            res.status(500).json({ message: "Error al generar PDF con Puppeteer" });
        }
    }


}

module.exports = ReporteController;
