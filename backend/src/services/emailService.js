const nodemailer = require("nodemailer");
const path = require("path");

// Función para formatear fechas en dd-mm-yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class EmailService {
    static async enviarPrestamoCorreo(prestamo) {
        const mailOptions = {
            from: `"XhavesXH - Sistema de Llaves Xel-Há" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "📌 Nueva llave prestada",
            html: `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color:#f7f9fc; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="text-align:center; margin-bottom:20px; background-color:#001f3f; padding:15px; border-radius:8px;">
                        <img src="cid:logoXH" alt="Logo XhavesXH" style="height:60px;"/>
                        <h2 style="color:#ffffff; margin:0;">XhavesXH - Sistema de Llaves Xel-Há</h2>
                    </div>
                    <h3 style="color:#001f3f;">Se ha registrado un préstamo</h3>
                    <table style="width:100%; border-collapse:collapse; margin-top:10px; background-color:#ffffff;">
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Solicitante:</b></td><td>${prestamo.solicitante}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Área:</b></td><td>${prestamo.area_solicitante}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Empleado:</b></td><td>${prestamo.num_empleado}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Fecha préstamo:</b></td><td>${formatDate(prestamo.fecha_prestamo)}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Hora préstamo:</b></td><td>${prestamo.hora_prestamo}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Llaves:</b></td><td>${prestamo.llaves.map(l => l.nombre_llave).join(", ")}</td></tr>
                        <tr><td style="padding:8px;"><b>Entregó Llaves:</b></td><td>${prestamo.responsable_presta || "N/A"}</td></tr>
                    </table>
                    <p style="margin-top:20px; font-size:13px; color:#001f3f; text-align:center; background-color:#f0f0f0; padding:10px; border-radius:6px;">
                        Este correo fue generado por <b>XhavesXH - Sistema de Llaves Xel-Há</b><br>
                        © ${new Date().getFullYear()} Todos los derechos reservados
                    </p>
                    </div>
            `,
            attachments: [
                {
                    filename: "logoXH.png",
                    path: path.join(__dirname, "../public/images/xcaret.png"),
                    cid: "logoXH" // mismo ID que usas en el src
                }
            ]
        };
        await transporter.sendMail(mailOptions);
    }

    static async enviarDevolucionCorreo(prestamo) {
        const mailOptions = {
            from: `"XhavesXH - Sistema de Llaves Xel-Há" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "✅ Llaves devueltas",
            html: `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color:#f7f9fc; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="text-align:center; margin-bottom:20px; background-color:#001f3f; padding:15px; border-radius:8px;">
                        <img src="cid:logoXH" alt="Logo XhavesXH" style="height:60px;"/>
                        <h2 style="color:#ffffff; margin:0;">XhavesXH - Sistema de Llaves Xel-Há</h2>
                    </div>
                    <h3 style="color:#28a745;">Se ha registrado una devolución</h3>
                    <table style="width:100%; border-collapse:collapse; margin-top:10px; background-color:#ffffff;">
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Solicitante:</b></td><td>${prestamo.solicitante}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Empleado:</b></td><td>${prestamo.num_empleado}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Fecha devolución:</b></td><td>${formatDate(prestamo.fecha_devolucion)}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Hora devolución:</b></td><td>${prestamo.hora_devolucion}</td></tr>
                        <tr><td style="padding:8px; border-bottom:1px solid #ddd;"><b>Llaves devueltas:</b></td><td>${prestamo.llaves.map(l => l.nombre_llave).join(", ")}</td></tr>
                        <tr><td style="padding:8px;"><b>Recibió Llaves:</b></td><td>${prestamo.responsable_recibe || "N/A"}</td></tr>
                    </table>
                    <p style="margin-top:20px; font-size:13px; color:#001f3f; text-align:center; background-color:#f0f0f0; padding:10px; border-radius:6px;">
                        Este correo fue generado por <b>XhavesXH - Sistema de Llaves Xel-Há</b><br>
                        © ${new Date().getFullYear()} Todos los derechos reservados
                    </p>
                    </div>
            `,
            attachments: [
                {
                    filename: "logoXH.png",
                    path: path.join(__dirname, "../public/images/xcaret.png"),
                    cid: "logoXH"
                }
            ]
        };
        await transporter.sendMail(mailOptions);
    }

    static async enviarDevolucionPendienteCorreo(prestamo) {
        const mailOptions = {
            from: `"XhavesXH - Sistema de Llaves Xel-Há" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "⚠️ Devolución pendiente de confirmación",
            html: `
                <div style="font-family: Arial; padding:20px;">
                <h3 style="color:#ffc107;">Se registró una devolución pendiente</h3>
                <p>El solicitante <b>${prestamo.solicitante}</b> devolvió llaves, pero aún falta confirmación del responsable.</p>
                <p>Llaves: ${prestamo.llaves.map(l => l.nombre_llave).join(", ")}</p>
                <p>Fecha: ${formatDate(prestamo.fecha_devolucion)} - Hora: ${prestamo.hora_devolucion}</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    }

    static async enviarConfirmacionDevolucionCorreo(prestamo) {
        const mailOptions = {
            from: `"XhavesXH - Sistema de Llaves Xel-Há" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "✅ Devolución confirmada",
            html: `
                <div style="font-family: Arial; padding:20px;">
                <h3 style="color:#28a745;">Se confirmó una devolución</h3>
                <p>El responsable <b>${prestamo.responsable_recibe}</b> confirmó la devolución de las llaves.</p>
                <p>Llaves: ${prestamo.llaves.map(l => l.nombre_llave).join(", ")}</p>
                <p>Fecha: ${formatDate(prestamo.fecha_devolucion)} - Hora: ${prestamo.hora_devolucion}</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    }

}

module.exports = EmailService;
