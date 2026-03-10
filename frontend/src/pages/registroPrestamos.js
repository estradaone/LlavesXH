import React, { useEffect, useState } from "react";
import styles from "./registroPrestamos.module.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { API_URL } from "../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegistrosPrestamos() {
    const [prestamos, setPrestamos] = useState([]);
    const [filtro, setFiltro] = useState("hoy");
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [año, setAño] = useState(new Date().getFullYear());
    const [responsables, setResponsables] = useState([]);
    const [showDevolverModal, setShowDevolverModal] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [responsableRecibe, setResponsableRecibe] = useState("");
    const [password, setPassword] = useState("");
    const [showActivarModal, setShowActivarModal] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [passwordActivar, setPasswordActivar] = useState("");

    // Cargar préstamos y responsables al inicio
    useEffect(() => {
        const cargarPrestamos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/prestamos/filtrados?filtro=${filtro}&mes=${mes}&año=${año}`);
                const data = await res.json();
                if (res.ok) {
                    setPrestamos(data);
                } else {
                    setPrestamos([]);
                }
            } catch (error) {
                toast.error("Error al cargar préstamos");
                setPrestamos([]);
            }
        };

        const cargarResponsables = async () => {
            try {
                const res = await fetch(`${API_URL}/api/responsable`);
                const data = await res.json();
                setResponsables(data);
            } catch (error) {
                toast.error("Error al cargar responsables");
            }
        };

        cargarPrestamos();
        cargarResponsables();
    }, [filtro, mes, año]);

    // abrir modal de dar llave
    const abrirActivarModal = (prestamo) => {
        setSelectedReserva(prestamo);
        setShowActivarModal(true);
    };

    const confirmarActivacion = async () => {
        if (!selectedReserva.id_responsable_presta) {
            toast.error("Debe seleccionar el responsable que entrega");
            return;
        }
        if (!passwordActivar) {
            toast.error("Debe ingresar la contraseña del responsable");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/prestamos/${selectedReserva.id_prestamo}/activar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_responsable_presta: selectedReserva.id_responsable_presta,
                    password: passwordActivar
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);

                const responsableObj = responsables.find(
                    r => r.id_responsable === parseInt(selectedReserva.id_responsable_presta)
                );

                setPrestamos(prestamos.map(p =>
                    p.id_prestamo === selectedReserva.id_prestamo
                        ? {
                            ...p, estado_prestamo: "prestada", responsable_presta: responsableObj
                                ? `${responsableObj.nombre_responsable} ${responsableObj.apellido_p} ${responsableObj.apellido_m}`
                                : "-"
                        }
                        : p
                ));

                setShowActivarModal(false);
                setPasswordActivar("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error al activar préstamo");
        }
    };

    // Abrir modal de devolución
    const abrirDevolverModal = (prestamo) => {
        setSelectedPrestamo({ ...prestamo, llavesDevolver: [] });
        setShowDevolverModal(true);
    };

    // Confirmar devolución
    const confirmarDevolucion = async () => {
        try {
            // Validar que haya llaves seleccionadas
            if (!selectedPrestamo.llavesDevolver || selectedPrestamo.llavesDevolver.length === 0) {
                toast.error("Debe seleccionar al menos una llave para devolver");
                return;
            }
            if (!responsableRecibe) {
                toast.error("Debe seleccionar el responsable que recibe")
            }
            if (!password) {
                toast.error("Debe ingresar la contraseña del responsable que recibe")
            }

            const fecha = new Date().toISOString().split("T")[0];
            const hora = new Date().toLocaleTimeString("es-MX", { hour12: false });

            const res = await fetch(`${API_URL}/api/prestamos/${selectedPrestamo.id_prestamo}/devolver`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_responsable_recibe: responsableRecibe,
                    password,
                    fecha,
                    hora,
                    id_llaves: selectedPrestamo.llavesDevolver //  enviar array de llaves seleccionadas
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);

                const responsableObj = responsables.find(r => r.id_responsable === parseInt(responsableRecibe));
                const now = new Date();
                const fechaDevolucion = now.toISOString().split("T")[0];
                const horaDevolucion = now.toLocaleTimeString("es-MX", { hour12: false });
                // Actualizar estado en frontend
                setPrestamos(prestamos.map(p =>
                    p.id_prestamo === selectedPrestamo.id_prestamo
                        ? {
                            ...p,
                            estado_prestamo: data.estado_prestamo,
                            responsable_recibe: responsableObj
                                ? `${responsableObj.nombre_responsable} ${responsableObj.apellido_p} ${responsableObj.apellido_m}`
                                : "-",
                            fecha_devolucion: fechaDevolucion,
                            hora_devolucion: horaDevolucion,
                            llaves: p.llaves.map(l =>
                                selectedPrestamo.llavesDevolver?.includes(l.id_llave)
                                    ? { ...l, estado: "devuelta" }
                                    : l
                            )
                        }
                        : p
                ));
                setShowDevolverModal(false);
                setPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error al devolver préstamo");
        }
    };

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Registros de Préstamos</h2>
                        {/* Filtro */}
                        <div className={styles.filter}>
                            <label>Filtrar por: </label>
                            <select value={filtro} onChange={e => setFiltro(e.target.value)}>
                                <option value="hoy">Hoy</option>
                                <option value="semana">Semana</option>
                                <option value="mes">Mes</option>
                                <option value="año">Año</option>
                                <option value="todo">Todo</option>
                            </select>

                            {filtro === "mes" && (
                                <>
                                    <label>Mes: </label>
                                    <select value={mes} onChange={e => setMes(e.target.value)}>
                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                    <label>Año: </label>
                                    <input type="number" value={año} onChange={e => setAño(e.target.value)} />
                                </>
                            )}

                            {filtro === "año" && (
                                <>
                                    <label>Año: </label>
                                    <input type="number" value={año} onChange={e => setAño(e.target.value)} />
                                </>
                            )}
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Llaves</th>
                                    <th>Zona</th>
                                    <th>Solicitante</th>
                                    <th>Área</th>
                                    <th>Num Colaborador</th>
                                    <th>Responsable Presta</th>
                                    <th>Responsable Recibe</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Hora Préstamo</th>
                                    <th>Fecha Devolución</th>
                                    <th>Hora Devolución</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map(p => (
                                    <tr key={p.id_prestamo}>
                                        {/* <td>{p.id_prestamo}</td> */}
                                        <td>{p.llaves.map(l => l.nombre_llave).join(", ")}</td>
                                        <td>{p.llaves.map(l => l.zona_llave).join(", ")}</td>
                                        <td>{p.solicitante}</td>
                                        <td>{p.area_solicitante}</td>
                                        <td>{p.num_empleado}</td>
                                        <td>{p.responsable_presta || "-"}</td>
                                        <td>{p.responsable_recibe || "-"}</td>
                                        <td>
                                            {new Date(p.fecha_prestamo).toLocaleDateString("es-MX", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            }).replace(/\//g, "-")}
                                        </td>
                                        <td>{p.hora_prestamo}</td>
                                        <td>
                                            {p.fecha_devolucion
                                                ? new Date(p.fecha_devolucion).toLocaleDateString("es-MX", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                }).replace(/\//g, "-") : "-"}
                                        </td>
                                        <td>{p.hora_devolucion || "-"}</td>
                                        <td className={styles.estadoCell}>
                                            {p.llaves.map(l => (
                                                <>
                                                    <span>{l.nombre_llave}</span>
                                                    <span className={
                                                        l.estado === "prestada" ? styles.badgePrestada :
                                                            l.estado === "anticipada" ? styles.badgeReservada :
                                                                styles.badgeDisponible
                                                    }>
                                                        {l.estado}
                                                    </span>
                                                </>
                                            ))}
                                        </td>

                                        <td className={styles.actions}>
                                            {(p.estado_prestamo === "prestada" || p.estado_prestamo === "parcial") && (
                                                <button className={styles.buttonSuccess} onClick={() => abrirDevolverModal(p)}>Devolver</button>
                                            )}
                                            {p.estado_prestamo === "anticipada" && (
                                                <button className={styles.buttonPrimary} onClick={() => abrirActivarModal(p)}>Dar llave</button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer />
            </div>
            {/* Modal de dar llave */}
            {showActivarModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Activar Préstamo (Dar llave)</h3>
                        <label>Responsable que entrega</label>
                        <select
                            value={selectedReserva?.id_responsable_presta || ""}
                            onChange={e => {
                                setSelectedReserva({ ...selectedReserva, id_responsable_presta: e.target.value })
                            }}
                        >
                            <option value=""> Seleccionar responsable</option>
                            {responsables.map(r => (
                                <option key={r.id_responsable} value={r.id_responsable}>
                                    {r.nombre_responsable} {r.apellido_p} {r.apellido_m}
                                </option>
                            ))}
                        </select>

                        <label>Contraseña del responsable</label>
                        <input
                            type="password"
                            value={passwordActivar}
                            onChange={e => setPasswordActivar(e.target.value)}
                        />
                        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                            <button className={styles.buttonPrimary} onClick={confirmarActivacion}>
                                Confirmar
                            </button>
                            <button className={styles.buttonDanger} onClick={() => setShowActivarModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Devolver llave  */}
            {showDevolverModal && (
                <div className={styles.modalOverlayDevolver}>
                    <div className={styles.modalDevolver}>
                        <h3>Devolver Llaves</h3>
                        <label>Seleccione llaves a devolver</label>
                        <div className={styles.checkboxContainerDevolver}>
                            {selectedPrestamo.llaves
                                .filter(l => l.estado !== "devuelta")
                                .map(l => (
                                    <div key={l.id_llave} className={styles.checkboxRowDevolver}>
                                        <span className={styles.llaveNombreDevolver}>{l.nombre_llave}</span>
                                        <input
                                            type="checkbox"
                                            value={l.id_llave}
                                            checked={selectedPrestamo.llavesDevolver?.includes(l.id_llave) || false}
                                            onChange={e => {
                                                let selected = [...(selectedPrestamo.llavesDevolver || [])];
                                                if (e.target.checked) {
                                                    selected.push(parseInt(e.target.value));
                                                } else {
                                                    selected = selected.filter(id => id !== parseInt(e.target.value));
                                                }
                                                setSelectedPrestamo({ ...selectedPrestamo, llavesDevolver: selected });
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                        <label>Responsable que recibe</label>
                        <select onChange={e => setResponsableRecibe(e.target.value)}>
                            <option value="">Seleccione responsable</option>
                            {responsables.map(r => (
                                <option key={r.id_responsable} value={r.id_responsable}>
                                    {r.nombre_responsable} {r.apellido_p} {r.apellido_m}
                                </option>
                            ))}
                        </select>
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                        <div className={styles.modalActionsDevolver}>
                            <button className={styles.buttonPrimaryDevolver} onClick={confirmarDevolucion}>Confirmar</button>
                            <button className={styles.buttonDangerDevolver} onClick={() => setShowDevolverModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default RegistrosPrestamos;
