const pool = require("../config/db");

class ReporteModel {
    static async obtenerPrestamos() {
        const query = `
      SELECT 
        p.id_prestamo,
        p.tipo_prestamo,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id_llave', l.id_llave,
            'nombre_llave', l.nombre_llave,
            'zona_llave', l.zona_llave,
            'estado', pl.estado
          )
        ) AS llaves,
        p.solicitante, 
        p.area_solicitante, 
        p.num_empleado,
        r1.nombre_responsable AS responsable_presta,
        r2.nombre_responsable AS responsable_recibe,
        fp.fecha AS fecha_prestamo, 
        fp.hora AS hora_prestamo,
        fd.fecha AS fecha_devolucion, 
        fd.hora AS hora_devolucion,
        p.estado_prestamo
      FROM prestamo p
      JOIN prestamo_llaves pl ON p.id_prestamo = pl.id_prestamo
      JOIN llave l ON pl.id_llave = l.id_llave
      LEFT JOIN responsable_llaves r1 ON p.id_responsable_presta = r1.id_responsable
      LEFT JOIN responsable_llaves r2 ON p.id_responsable_recibe = r2.id_responsable
      LEFT JOIN fecha_prestamo fp ON p.id_prestamo = fp.id_prestamo
      LEFT JOIN fecha_devolucion fd ON p.id_prestamo = fd.id_prestamo
      GROUP BY p.id_prestamo;
    `;
        const [rows] = await pool.query(query);
        return rows.map(r => ({
            ...r,
            llaves: typeof r.llaves === "string" ? JSON.parse(r.llaves) : r.llaves
        }));
    }

    static async obtenerPrestamosFiltrados(filtro, mes = null, año = null) {
        let whereClause = "";
        const params = [];

        switch (filtro) {
            case "hoy":
                whereClause = "WHERE DATE(fp.fecha) = CURDATE()";
                break;
            case "semana":
                whereClause = "WHERE YEARWEEK(fp.fecha, 1) = YEARWEEK(CURDATE(), 1)";
                break;
            case "mes":
                if (mes && año) {
                    whereClause = "WHERE YEAR(fp.fecha) = ? AND MONTH(fp.fecha) = ?";
                    params.push(año, mes);
                } else {
                    whereClause = "WHERE YEAR(fp.fecha) = YEAR(CURDATE()) AND MONTH(fp.fecha) = MONTH(CURDATE())";
                }
                break;
            case "año":
                if (año) {
                    whereClause = "WHERE YEAR(fp.fecha) = ?";
                    params.push(año);
                } else {
                    whereClause = "WHERE YEAR(fp.fecha) = YEAR(CURDATE())";
                }
                break;
            case "todo":
            default:
                whereClause = "";
                break;
        }

        const query = `
      SELECT 
        p.id_prestamo,
        p.tipo_prestamo,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id_llave', l.id_llave,
            'nombre_llave', l.nombre_llave,
            'zona_llave', l.zona_llave,
            'estado', pl.estado
          )
        ) AS llaves,
        p.solicitante, 
        p.area_solicitante, 
        p.num_empleado,
        r1.nombre_responsable AS responsable_presta,
        r2.nombre_responsable AS responsable_recibe,
        fp.fecha AS fecha_prestamo, 
        fp.hora AS hora_prestamo,
        fd.fecha AS fecha_devolucion, 
        fd.hora AS hora_devolucion,
        p.estado_prestamo
      FROM prestamo p
      JOIN prestamo_llaves pl ON p.id_prestamo = pl.id_prestamo
      JOIN llave l ON pl.id_llave = l.id_llave
      LEFT JOIN responsable_llaves r1 ON p.id_responsable_presta = r1.id_responsable
      LEFT JOIN responsable_llaves r2 ON p.id_responsable_recibe = r2.id_responsable
      LEFT JOIN fecha_prestamo fp ON p.id_prestamo = fp.id_prestamo
      LEFT JOIN fecha_devolucion fd ON p.id_prestamo = fd.id_prestamo
      ${whereClause}
      GROUP BY p.id_prestamo;
    `;

        const [rows] = await pool.query(query, params);
        return rows.map(r => ({
            ...r,
            llaves: typeof r.llaves === "string" ? JSON.parse(r.llaves) : r.llaves
        }));
    }
}

module.exports = ReporteModel;
