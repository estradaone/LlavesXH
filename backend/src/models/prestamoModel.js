const pool = require('../config/db');

const prestamoModel = {
    // Registrar préstamo
    async crearPrestamo({ id_llaves, solicitante, area_solicitante, num_empleado, id_responsable_presta, password, fecha, hora, tipo_prestamo }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            let estadoInicial = 'prestada';

            if (tipo_prestamo === 'anticipado') {
                estadoInicial = 'anticipada';
                id_responsable_presta = null;
                password = null;
            } else {
                const [rows] = await conn.query(
                    `SELECT * FROM responsable_llaves WHERE id_responsable = ? AND password = ?`,
                    [id_responsable_presta, password]
                );
                if (rows.length === 0) throw new Error("Contraseña incorrecta para el responsable que presta la llave");
            }

            const [result] = await conn.query(`
                INSERT INTO prestamo (solicitante, area_solicitante, num_empleado, id_responsable_presta, estado_prestamo, tipo_prestamo)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [solicitante, area_solicitante, num_empleado, id_responsable_presta, estadoInicial, tipo_prestamo]);

            const id_prestamo = result.insertId;

            await conn.query(`
                INSERT INTO fecha_prestamo (id_prestamo, fecha, hora)
                VALUES (?, ?, ?)
            `, [id_prestamo, fecha, hora]);

            for (const id_llave of id_llaves) {
                await conn.query(`
                INSERT INTO prestamo_llaves (id_prestamo, id_llave, estado)
                VALUES (?, ?, ?)
            `, [id_prestamo, id_llave, estadoInicial]);

                if (estadoInicial === 'prestada') {
                    await conn.query(`UPDATE llave SET estado = 'prestada' WHERE id_llave = ?`, [id_llave]);

                    await conn.query(`
                    INSERT INTO checklist_entrega (id_prestamo, id_responsable, id_llave, entrego_llave)
                    VALUES (?, ?, ?, 1)
                `, [id_prestamo, id_responsable_presta, id_llave]);
                } else if (estadoInicial === 'anticipada') {
                    await conn.query(`UPDATE llave SET estado = 'anticipada' WHERE id_llave = ?`, [id_llave]);
                }
            }
            await conn.commit();
            return id_prestamo;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    // Listar préstamos
    async obtenerPrestamos() {
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
    },
    // filtro de registro 
    async obtenerPrestamosFiltrados(filtro, mes = null, año = null) {
        let whereClause = "";

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
                } else {
                    whereClause = "WHERE YEAR(fp.fecha) = YEAR(CURDATE()) AND MONTH(fp.fecha) = MONTH(CURDATE())";
                }
                break;
            case "año":
                if (año) {
                    whereClause = "WHERE YEAR(fp.fecha) = ?";
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

        const params = [];
        if (filtro === "mes" && mes && año) {
            params.push(año, mes);
        } else if (filtro === "año" && año) {
            params.push(año);
        }

        const [rows] = await pool.query(query, params);
        return rows.map(r => ({
            ...r,
            llaves: typeof r.llaves === "string" ? JSON.parse(r.llaves) : r.llaves
        }));
    },
    // llaves prestadas 
    async obtenerLlavesPrestadas() {
        const query = `
        SELECT 
            l.nombre_llave,
            l.zona_llave,
            p.solicitante,
            p.area_solicitante
        FROM prestamo p
        JOIN prestamo_llaves pl ON p.id_prestamo = pl.id_prestamo
        JOIN llave l ON pl.id_llave = l.id_llave
        WHERE pl.estado = 'prestada';
    `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Devolver llaves (parcial o total)
    async devolverLlaves(id_prestamo, id_responsable_recibe, password, fecha, hora, id_llaves) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Validar contraseña del responsable que recibe
            const [rows] = await conn.query(
                `SELECT * FROM responsable_llaves WHERE id_responsable = ? AND password = ?`,
                [id_responsable_recibe, password]
            );
            if (rows.length === 0) throw new Error("Contraseña incorrecta para el responsable que recibe la llave");

            // Actualizar responsable que recibe en el préstamo
            await conn.query(
                `UPDATE prestamo SET id_responsable_recibe = ? WHERE id_prestamo = ?`,
                [id_responsable_recibe, id_prestamo]
            );

            // Registrar fecha de devolución (si ya existe, actualizar)
            await conn.query(`
            INSERT INTO fecha_devolucion (id_prestamo, fecha, hora)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE fecha = VALUES(fecha), hora = VALUES(hora)
        `, [id_prestamo, fecha, hora]);

            // Procesar cada llave devuelta
            for (const id_llave of id_llaves) {
                // Actualizar estado de la llave física
                await conn.query(
                    `UPDATE llave SET estado = 'disponible' WHERE id_llave = ?`,
                    [id_llave]
                );

                // Actualizar estado en la relación préstamo-llaves
                await conn.query(
                    `UPDATE prestamo_llaves
                    SET estado = 'devuelta'
                    WHERE id_prestamo = ? AND id_llave = ?`,
                    [id_prestamo, id_llave]
                );

                // Registrar checklist de recepción con id_llave
                await conn.query(
                    `INSERT INTO checklist_recibe (id_prestamo, id_responsable, id_llave, recibio_llave)
                    VALUES (?, ?, ?, 1)`,
                    [id_prestamo, id_responsable_recibe, id_llave]
                );
            }

            const totalDevueltas = id_llaves.length;

            // Verificar si quedan llaves prestadas
            const [prestadas] = await conn.query(`
            SELECT COUNT(*) AS restantes
            FROM prestamo_llaves
            WHERE id_prestamo = ? AND estado = 'prestada'
        `, [id_prestamo]);

            let message;
            // Si ya no quedan llaves prestadas, marcar préstamo como devuelto
            if (prestadas[0].restantes === 0) {
                // Todas las llaves del prestamo ya fueron devueltas
                message = totalDevueltas > 1
                    ? "Todas las llaves devueltas correctamente"
                    : "Llave devuelta correctamente";
                await conn.query(
                    `UPDATE prestamo SET estado_prestamo = 'devuelto' WHERE id_prestamo = ?`,
                    [id_prestamo]
                );
            } else {
                //Devolución parcial
                message = totalDevueltas > 1
                    ? "Se devolvieron las llaves seleccionadas"
                    : "Llave devuelta correctamente";
            }

            await conn.commit();
            return {
                message, estado_prestamo: prestadas[0].restantes === 0 ? "devuelto" : "parcial"
            };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },
    // Activar préstamo
    async activarPrestamo(id_prestamo, id_responsable_presta, password) {
        const conn = await pool.getConnection();
        const [prestamo] = await conn.query(
            `SELECT estado_prestamo FROM prestamo WHERE id_prestamo = ?`,
            [id_prestamo]
        );
        if (prestamo[0].estado_prestamo !== 'anticipada') {
            throw new Error("El préstamo no está en estado anticipada");
        }

        try {
            await conn.beginTransaction();

            // Validar contraseña del responsable
            const [rows] = await conn.query(
                `SELECT * FROM responsable_llaves WHERE id_responsable = ? AND password = ?`,
                [id_responsable_presta, password]
            );
            if (rows.length === 0) throw new Error("Contraseña incorrecta");

            // Cambiar estado del préstamo
            await conn.query(
                `UPDATE prestamo 
                SET estado_prestamo = 'prestada', id_responsable_presta = ?
                WHERE id_prestamo = ?`,
                [id_responsable_presta, id_prestamo]
            );

            // Obtener todas las llaves asociadas al préstamo
            const [llaves] = await conn.query(
                `SELECT id_llave FROM prestamo_llaves WHERE id_prestamo = ?`,
                [id_prestamo]
            );

            // Procesar cada llave
            for (const { id_llave } of llaves) {
                // Actualizar estado de la llave física
                await conn.query(
                    `UPDATE llave SET estado = 'prestada' WHERE id_llave = ?`,
                    [id_llave]
                );

                // Actualizar estado en la relación
                await conn.query(
                    `UPDATE prestamo_llaves
                    SET estado = 'prestada'
                    WHERE id_prestamo = ? AND id_llave = ?`,
                    [id_prestamo, id_llave]
                );

                // Registrar checklist de entrega con id_llave
                await conn.query(
                    `INSERT INTO checklist_entrega (id_prestamo, id_responsable, id_llave, entrego_llave)
                    VALUES (?, ?, ?, 1)`,
                    [id_prestamo, id_responsable_presta, id_llave]
                );
            }

            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

};

module.exports = prestamoModel;
