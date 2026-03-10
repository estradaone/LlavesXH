import React, { useState, useEffect } from "react";
import styles from "./adminDashboard.module.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
    const [llaves, setLlaves] = useState([]);
    const [nombreLlave, setNombreLlave] = useState("");
    const [zonaLlave, setZonaLlave] = useState("");
    const [cantidadLlave, setCantidadLlave] = useState("");

    //Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLlave, setSelectedLlave] = useState(null);

    const cargarLlaves = async () => {
        const data = await fetch(`${API_URL}/api/llaves`).then(res => res.json());
        setLlaves(data);
    };

    useEffect(() => {
        cargarLlaves();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/llaves`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_llave: nombreLlave,
                    zona_llave: zonaLlave,
                    cantidad_llave: cantidadLlave,
                    estado: "disponible"
                }),
            });

            if (response.ok) {
                toast.success("Llave registrada correctamente");
                cargarLlaves();
                setNombreLlave("");
                setZonaLlave("");
                setCantidadLlave("");
            } else {
                toast.error("Error al registrar llave");
            }
        } catch (error) {
            toast.error("Error en el servidor");
        }
    };

    //Abrir modal con datos de la llave
    const openModal = (llave) => {
        setSelectedLlave(llave);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLlave(null);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${API_URL}/api/llaves/${selectedLlave.id_llave}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Si tu backend requiere token JWT, agrega aquí:
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(selectedLlave)
            });

            if (response.ok) {
                toast.success("Llave actualizada correctamente");
                closeModal();
                cargarLlaves();
            } else {
                toast.error("Error al actualizar llave");
            }
        } catch (error) {
            toast.error("Error en el servidor");
        }
    };

    const handleSuspend = async (id) => {
        await fetch(`${API_URL}/api/llaves/suspender/${id}`, { method: "PUT" });
        toast.info("Llave suspendida");
        cargarLlaves();
    };

    // Métricas de llaves disponibles
    const totalDisponibles = llaves.filter(llave => llave.estado === "disponible").length;

    const metricasDisponiblesPorZona = llaves
        .filter(llave => llave.estado === "disponible")
        .reduce((acc, llave) => {
            acc[llave.zona_llave] = (acc[llave.zona_llave] || 0) + 1;
            return acc;
        }, {});

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Panel de Administración</h2>

                        <div className={styles.topActions}>
                            <Link to="/admin/suspended" className={styles.buttonSecondary}>
                                Ver llaves suspendidas
                            </Link>
                        </div>

                        <div className={styles.metrics}>
                            <p>Total de llaves disponibles: <strong>{totalDisponibles}</strong></p>
                            <ul>
                                {Object.entries(metricasDisponiblesPorZona).map(([zona, cantidad]) => (
                                    <li key={zona}>
                                        {zona}: {cantidad}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form onSubmit={handleRegister} className={styles.form}>
                            <input
                                type="text"
                                placeholder="Nombre de la llave"
                                value={nombreLlave}
                                onChange={(e) => setNombreLlave(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <select
                                value={zonaLlave}
                                onChange={(e) => setZonaLlave(e.target.value)}
                                className={styles.input}
                                required
                            >
                                <option value="">Selecciona una zona</option>
                                <option value="Principal">Principal</option>
                                <option value="Caleta">Caleta</option>
                                <option value="Pueblito">Pueblito</option>
                                <option value="Rio">Rio</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Cantidad"
                                value={cantidadLlave}
                                onChange={(e) => setCantidadLlave(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <button type="submit" className={styles.button}>
                                Registrar Llave
                            </button>
                        </form>

                        <h3 className={styles.subtitle}>Listado de llaves</h3>
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
                                {llaves
                                    .filter(llave => llave.estado === "disponible")
                                    .map(llave => (
                                        <tr key={llave.id_llave}>
                                            <td>{llave.nombre_llave}</td>
                                            <td>{llave.zona_llave}</td>
                                            <td>{llave.cantidad_llave}</td>
                                            <td>
                                                <span className={styles.badgeDisponible}>{llave.estado}</span>
                                            </td>
                                            <td className={styles.actions}>
                                                <button
                                                    onClick={() => openModal(llave)}
                                                    className={styles.buttonSecondary}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleSuspend(llave.id_llave)}
                                                    className={styles.buttonWarning}
                                                >
                                                    Suspender
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Modal de edición */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Editar Llave</h3>
                        <form className={styles.formModal}>
                            <label>
                                Nombre de la llave:
                                <input
                                    type="text"
                                    value={selectedLlave.nombre_llave}
                                    onChange={(e) =>
                                        setSelectedLlave({ ...selectedLlave, nombre_llave: e.target.value })
                                    }
                                    className={styles.input}
                                />
                            </label>

                            <label>
                                Zona:
                                <select
                                    value={selectedLlave.zona_llave}
                                    onChange={(e) =>
                                        setSelectedLlave({ ...selectedLlave, zona_llave: e.target.value })
                                    }
                                    className={styles.input}
                                >
                                    {/* <option value="">Selecciona una zona</option> */}
                                    <option value="Principal">Principal</option>
                                    <option value="Caleta">Caleta</option>
                                    <option value="Pueblito">Pueblito</option>
                                    <option value="Rio">Rio</option>
                                </select>
                            </label>

                            <label>
                                Cantidad:
                                <input
                                    type="number"
                                    value={selectedLlave.cantidad_llave}
                                    onChange={(e) =>
                                        setSelectedLlave({ ...selectedLlave, cantidad_llave: e.target.value })
                                    }
                                    className={styles.input}
                                />
                            </label>

                            <div className={styles.modalButtons}>
                                <button type="button" onClick={handleUpdate} className={styles.buttonSuccess}>
                                    Guardar cambios
                                </button>
                                <button type="button" onClick={closeModal} className={styles.buttonDanger}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" autoClose={3000}/>
        </div>
    );
}

export default AdminDashboard;
