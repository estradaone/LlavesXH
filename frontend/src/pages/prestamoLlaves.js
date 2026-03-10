import React, { useState, useEffect } from "react";
import styles from "./prestamoLlaves.module.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { API_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

function PrestamoLlaves() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_llaves: [],
        solicitante: "",
        area_solicitante: "",
        num_empleado: "",
        id_responsable_presta: "",
        fecha: "",
        hora: "",
        tipo_prestamo: "inmediato"
    });

    const today = new Date();
    const localDate = today.toLocaleDateString("en-CA");

    const [llaves, setLlaves] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");
    const [intentos, setIntentos] = useState(0);

    // Cargar responsables
    useEffect(() => {
        const cargarResponsables = async () => {
            const res = await fetch(`${API_URL}/api/responsable`);
            const data = await res.json();
            setResponsables(data);
        };
        cargarResponsables();
    }, []);

    // Cargar todas las llaves
    useEffect(() => {
        const cargarLlaves = async () => {
            const res = await fetch(`${API_URL}/api/llaves`);
            const data = await res.json();
            setLlaves(data);
        };
        cargarLlaves();
    }, []);

    // Abrir modal
    const abrirModal = () => {
        if (formData.tipo_prestamo === "anticipado") {
            if (
                formData.id_llaves.length === 0 ||
                !formData.solicitante ||
                !formData.area_solicitante ||
                !formData.num_empleado ||
                !formData.fecha ||
                !formData.hora
            ) {
                toast.error("Todos los campos son obligatorios 1");
                return;
            }
            registrarPrestamo();
        } else {
            if (
                formData.id_llaves.length === 0 ||
                !formData.solicitante ||
                !formData.area_solicitante ||
                !formData.num_empleado ||
                !formData.fecha ||
                !formData.hora ||
                !formData.id_responsable_presta
            ) {
                toast.error("Todos los campos son obligatorios 2");
                return;
            }
            setShowModal(true);
        }
    };

    // Registrar préstamo
    const registrarPrestamo = async () => {
        try {
            const res = await fetch(`${API_URL}/api/prestamos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, password })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(
                    formData.tipo_prestamo === "anticipado"
                        ? "Reserva registrada correctamente"
                        : "Prestamo registrado correctamente"
                );
                setTimeout(() => {
                    navigate("/registroPrestamo");
                }, 2000);
            } else {
                setIntentos(intentos + 1);
                toast.error(data.message || "Contraseña incorrecta");
                if (intentos + 1 >= 3) {
                    toast.warning("Demasiados intentos fallidos, seleccione otro responsable");
                    setShowModal(false);
                    setIntentos(0);
                    setPassword("");
                }
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        }
    };

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Solicitar Llave</h2>
                        <form className={styles.form}>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <Select
                                            isMulti
                                            options={llaves.map(l => ({
                                                value: l.id_llave,
                                                label: `${l.nombre_llave} (${l.zona_llave}) ${l.estado === "prestada" ? " - Ocupada" :
                                                        l.estado === "anticipada" ? " - Anticipada" : ""
                                                    }`,
                                                isDisabled: l.estado === "prestada" || l.estado === "anticipada"
                                            }))}
                                            onChange={selectedOptions => {
                                                setFormData({
                                                    ...formData,
                                                    id_llaves: selectedOptions.map(opt => opt.value)
                                                });
                                            }}
                                            placeholder="Seleccione llaves..."
                                            className={styles.reactSelect}
                                            classNamePrefix="select"
                                        />
                                        {/* <label className={styles.label}>Llaves</label> */}
                                    </div>
                                </div>
                            </div>
                            {/* Checkbox de anticipado */}
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData.tipo_prestamo === "anticipado"}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    tipo_prestamo: e.target.checked ? "anticipado" : "inmediato"
                                                })
                                            }
                                        />
                                        <span> Pedir con anticipación </span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            value={formData.solicitante || ""}
                                            className={styles.input}
                                            required
                                            placeholder=" "
                                            onChange={e => setFormData({ ...formData, solicitante: e.target.value })}
                                        />
                                        <label className={styles.label}>Solicitante</label>
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            value={formData.area_solicitante || ""}
                                            className={styles.input}
                                            required
                                            placeholder=" "
                                            onChange={e => setFormData({ ...formData, area_solicitante: e.target.value })}
                                        />
                                        <label className={styles.label}>Área solicitante</label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            value={formData.num_empleado || ""}
                                            className={styles.input}
                                            required
                                            placeholder=" "
                                            onChange={e => setFormData({ ...formData, num_empleado: e.target.value })}
                                        />
                                        <label className={styles.label}>Número empleado</label>
                                    </div>
                                </div>

                                {formData.tipo_prestamo === "inmediato" && (
                                    <div className={styles.field}>
                                        <div className={styles.inputGroup}>
                                            <select
                                                value={formData.id_responsable_presta || ""}
                                                className={styles.input}
                                                required
                                                onChange={e => setFormData({ ...formData, id_responsable_presta: e.target.value })}>
                                                <option value="">Seleccione responsable</option>
                                                {responsables.map(r => (
                                                    <option key={r.id_responsable} value={r.id_responsable}>
                                                        {r.nombre_responsable} {r.apellido_p} {r.apellido_m}
                                                    </option>
                                                ))}
                                            </select>
                                            <label className={styles.label}>Responsable</label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="date"
                                            required
                                            className={styles.input}
                                            placeholder=" "
                                            min={localDate}  // Se establece hoy como minimo
                                            onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                        />
                                        <label className={styles.label}>Fecha de préstamo</label>
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            onChange={e => setFormData({ ...formData, hora: e.target.value })}
                                        />
                                        <label className={styles.label}>Hora de préstamo</label>
                                    </div>
                                </div>
                            </div>

                            <button type="button" className={styles.buttonPrimary} onClick={abrirModal}>
                                Registrar Préstamo
                            </button>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Ingrese contraseña del responsable</h3>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                            <button className={styles.buttonPrimary} onClick={registrarPrestamo}>Confirmar</button>
                            <button className={styles.buttonDanger} onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default PrestamoLlaves;
