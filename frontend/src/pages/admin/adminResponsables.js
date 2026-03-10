import React, { useState, useEffect } from "react";
import styles from "./responsable.module.css";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { API_URL } from "../../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminResponsables() {
    const [responsables, setResponsables] = useState([]);
    const [formData, setFormData] = useState({
        nombre_responsable: "",
        apellido_p: "",
        apellido_m: "",
        num_empleado: "",
        correo: "",
        password: ""
    });
    const [editing, setEditing] = useState(null); // responsable en edición
    const [editData, setEditData] = useState({}); // datos del modal
    const [deleting, setDeleting] = useState(null);  // Confirmacion de eliminación

    // Cargar responsables
    const cargarResponsables = async () => {
        const data = await fetch(`${API_URL}/api/responsable`).then(res => res.json());
        setResponsables(data);
    };

    useEffect(() => {
        cargarResponsables();
    }, []);

    // Registrar responsable
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/responsable`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const result = await res.json();
                toast.success(result.message || "Responsable agregado correctamente");
                setFormData({
                    nombre_responsable: "",
                    apellido_p: "",
                    apellido_m: "",
                    num_empleado: "",
                    correo: "",
                    password: ""
                });
                cargarResponsables();
            } else {
                toast.error("Error al registrar responsable")
            }
        } catch (error) {
            toast.error("Error en el servidor");
        }
    };

    // Eliminar responsable
    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/api/responsable/${deleting.id_responsable}`, { method: "DELETE" });
            if (res.ok) {
                toast.warning(`Responsable ${deleting.nombre_responsable} eliminado`);
                setDeleting(null);
                cargarResponsables();

            } else {
                toast.error("Error al eliminar responsable");
            }
        } catch (error) {
            toast.error("Error en el servidor");
        }
    };

    // Abrir modal de edición
    const openEditModal = (responsable) => {
        setEditing(responsable.id_responsable);
        setEditData({ ...responsable });
    };
    // Cerrar modal
    // const closeModal = () => {
    //     setEditing(null);
    //     setEditData({});
    // }

    // Guardar cambios
    const handleUpdate = async () => {
        try {
            const res = await fetch(`${API_URL}/api/responsable/${editing}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            if(res.ok) {
                toast.success("Cambios actualizados correctamente");
                setEditing(null);
                cargarResponsables();
            } else {
                toast.error("Error al actualizar cambios");
            }
        } catch(error) {
            toast.error("Error interno");
        }
    };

    return (
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Responsables de Llaves</h2>                        
                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input type="text" placeholder="Nombre" value={formData.nombre_responsable}
                                onChange={e => setFormData({ ...formData, nombre_responsable: e.target.value })} />
                            <input type="text" placeholder="Apellido Paterno" value={formData.apellido_p}
                                onChange={e => setFormData({ ...formData, apellido_p: e.target.value })} />
                            <input type="text" placeholder="Apellido Materno" value={formData.apellido_m}
                                onChange={e => setFormData({ ...formData, apellido_m: e.target.value })} />
                            <input type="text" placeholder="Número de empleado" value={formData.num_empleado}
                                onChange={e => setFormData({ ...formData, num_empleado: e.target.value })} />
                            <input type="email" placeholder="Correo" value={formData.correo}
                                onChange={e => setFormData({ ...formData, correo: e.target.value })} />
                            <input type="password" placeholder="Contraseña" value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <button type="submit" className={styles.buttonSuccess}>Registrar</button>
                        </form>

                        {/* Tabla */}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido Paterno</th>
                                    <th>Apellido Materno</th>
                                    <th>Num Colaborador</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responsables.map(r => (
                                    <tr key={r.id_responsable}>
                                        <td data-label="Nombre">{r.nombre_responsable}</td>
                                        <td data-label="Apellido P">{r.apellido_p}</td>
                                        <td data-label="Apellido M">{r.apellido_m}</td>
                                        <td data-label="Número">{r.num_empleado}</td>
                                        <td data-label="Correo">{r.correo}</td>
                                        <td data-label="Acciones" className={styles.actions}>
                                            <button onClick={() => openEditModal(r)} className={styles.buttonSecondary}>Editar</button>
                                            <button onClick={() => setDeleting(r)} className={styles.buttonDanger}>Eliminar</button>
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
            {editing && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Editar Responsable</h3>
                        <form className={styles.formModal}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={editData.nombre_responsable}
                                    onChange={e => setEditData({ ...editData, nombre_responsable: e.target.value })}
                                />
                            </label>
                            <label>
                                Apellido Paterno:
                                <input
                                    type="text"
                                    value={editData.apellido_p}
                                    onChange={e => setEditData({ ...editData, apellido_p: e.target.value })}
                                />
                            </label>
                            <label>
                                Apellido Materno:
                                <input
                                    type="text"
                                    value={editData.apellido_m}
                                    onChange={e => setEditData({ ...editData, apellido_m: e.target.value })}
                                />
                            </label>
                            <label>
                                Número de empleado:
                                <input
                                    type="text"
                                    value={editData.num_empleado}
                                    onChange={e => setEditData({ ...editData, num_empleado: e.target.value })}
                                />
                            </label>
                            <label>
                                Correo:
                                <input
                                    type="email"
                                    value={editData.correo}
                                    onChange={e => setEditData({ ...editData, correo: e.target.value })}
                                />
                            </label>
                            <label>
                                Contraseña:
                                <input
                                    type="password"
                                    value={editData.password}
                                    onChange={e => setEditData({ ...editData, password: e.target.value })}
                                />
                            </label>

                            <div className={styles.actions}>
                                <button type="button" onClick={handleUpdate} className={styles.buttonSuccess}>Guardar</button>
                                <button type="button" onClick={() => setEditing(null)} className={styles.buttonDanger}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleting && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modal} ${styles.modalConfirm}`}>
                        <h3>¿Eliminar responsable?</h3>
                        <p>Estás a punto de eliminar a <strong>{deleting.nombre_responsable}</strong>.</p>
                        <div className={styles.actions}>
                            <button onClick={handleDelete} className={styles.buttonDanger}>Sí, eliminar</button>
                            <button onClick={() => setDeleting(null)} className={styles.buttonSecondary}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default AdminResponsables;
