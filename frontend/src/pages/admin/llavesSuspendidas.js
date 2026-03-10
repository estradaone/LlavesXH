import React, { useState, useEffect } from "react";
import styles from "./llavesSuspendidas.module.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSuspended() {
    const [llavesSuspendidas, setLlavesSuspendidas] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [llaveToDelete, setLlaveToDelete] = useState(null);



    const cargarSuspendidas = async () => {
        const data = await fetch(`${API_URL}/api/llaves`).then(res => res.json());
        // Filtrar solo las suspendidas
        setLlavesSuspendidas(data.filter(llave => llave.estado === "suspendida"));
    };

    useEffect(() => {
        cargarSuspendidas();
    }, []);

    const handleActivate = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/llaves/activar/${id}`, { method: "PUT" });
            if (response.ok) {
                toast.success("Llave activada correctamente");
                cargarSuspendidas();
            } else {
                toast.error("Error al activar llave");
            }
        } catch (error) {
            toast.error("Error en el servidor");
        }
    };


    const handleDelete = async () => {
        if (!llaveToDelete) {
            toast.error("No hay llave seleccionada para eliminar");
            return;
        }

        try {
            console.log("Eliminando llave:", llaveToDelete); // Debug
            const response = await fetch(`${API_URL}/api/llaves/${llaveToDelete.id_llave}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                toast.warning(`Llave "${llaveToDelete.nombre_llave}" eliminada`);
                cargarSuspendidas();
                closeDeleteModal();
            } else {
                const errorText = await response.text();
                console.error("Error al eliminar:", errorText);
                toast.error("Error al eliminar llave");
            }
        } catch (error) {
            console.error("Error en el servidor:", error);
            toast.error("Error en el servidor");
        }
    };


    const openDeleteModal = (llave) => {
        setLlaveToDelete(llave);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setLlaveToDelete(null);
    };


    // Métricas
    const totalSuspendidas = llavesSuspendidas.length;
    const metricasPorZona = llavesSuspendidas.reduce((acc, llave) => {
        acc[llave.zona_llave] = (acc[llave.zona_llave] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Llaves Suspendidas</h2>

                        {/* Botón para ir a llaves suspendidas */}
                        <div className={styles.topActions}>
                            <Link to="/admin/dashboard" className={styles.buttonSecondary}>
                                Volver a llaves activas
                            </Link>
                        </div>

                        {/* Métricas */}
                        <div className={styles.metrics}>
                            <p>Total suspendidas: <strong>{totalSuspendidas}</strong></p>
                            <ul>
                                {Object.entries(metricasPorZona).map(([zona, cantidad]) => (
                                    <li key={zona}>
                                        {zona}: {cantidad}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tabla de llaves suspendidas */}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Zona</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {llavesSuspendidas.map(llave => (
                                    <tr key={llave.id_llave}>
                                        <td>{llave.nombre_llave}</td>
                                        <td>{llave.zona_llave}</td>
                                        <td>{llave.cantidad_llave}</td>
                                        <td>
                                            <span className={styles.badgeSuspendida}>
                                                {llave.estado}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button onClick={() => handleActivate(llave.id_llave)} className={styles.buttonSuccess}>Activar</button>
                                            <button onClick={() => openDeleteModal(llave)} className={styles.buttonDanger}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer />
            </div>
            {isDeleteModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Confirmar eliminación</h3>
                        <p>¿Seguro que deseas eliminar la llave <strong>{llaveToDelete.nombre_llave}</strong>?</p>
                        <div className={styles.modalButtons}>
                            <button onClick={handleDelete} className={styles.buttonDanger}>
                                Sí, eliminar
                            </button>
                            <button onClick={closeDeleteModal} className={styles.buttonSecondary}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default AdminSuspended;
