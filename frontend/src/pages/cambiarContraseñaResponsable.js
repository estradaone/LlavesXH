import React, { useState } from "react";
import { API_URL } from "../config/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import styles from "./cambiarContraseña.module.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function CambiarPasswordResponsable() {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas nuevas no coinciden");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/responsable/cambiar-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo: email,
                    actualPassword: currentPassword,
                    nuevaPassword: newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Contraseña cambiada correctamente");
                setEmail("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message || "Error al cambiar contraseña");
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
                        <h2 className={styles.title}>Cambio de contraseña</h2>

                        {/* Aviso de seguridad */}
                        <div className={styles.warning}>
                            OJO: Solo para responsables de llaves
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Contraseña actual</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.buttonPrimary}>
                                Guardar
                            </button>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default CambiarPasswordResponsable;
