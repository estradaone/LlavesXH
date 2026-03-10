import React, { useEffect, useState } from "react";
import styles from "./registroPrestamos.module.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { API_URL } from "../config/api";

function LlavesPrestadas() {
    const [llaves, setLlaves] = useState([]);

    useEffect(() => {
        const cargarLlaves = async () => {
            try {
                const res = await fetch(`${API_URL}/api/prestamos/llaves-prestadas`);
                const data = await res.json();
                if (res.ok) {
                    setLlaves(data);
                } else {
                    setLlaves([]);
                }
            } catch (error) {
                console.error("Error al cargar llaves prestadas:", error);
                setLlaves([]);
            }
        };
        cargarLlaves();
    }, []);

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Llaves Prestadas</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre Llave</th>
                                    <th>Zona</th>
                                    <th>Solicitante</th>
                                    <th>Área</th>
                                </tr>
                            </thead>
                            <tbody>
                                {llaves.length > 0 ? (
                                    llaves.map((l, index) => (
                                        <tr key={index}>
                                            <td>{l.nombre_llave}</td>
                                            <td>{l.zona_llave}</td>
                                            <td>{l.solicitante}</td>
                                            <td>{l.area_solicitante}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className={styles.empty}>
                                            No hay llaves prestadas actualmente
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default LlavesPrestadas;
