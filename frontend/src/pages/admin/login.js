import React, { useContext, useState } from "react";
import styles from './login.module.css';
import Navbar from "../../components/navbar";
import { AuthContext } from "../../context/authContext";
import { API_URL } from "../../config/api";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";

function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Guardar token en localStorage
                localStorage.setItem("token", data.token);

                setNotification('Login exitoso ✅');
                setTimeout(() => setNotification(null), 3000);

                // Actualizar contexto y redirigir
                login(data.token);
                navigate('/admin/home', { replace: true });
            } else {
                setNotification(data.message || "Credenciales inválidas");
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            setNotification('Hubo un error en el servidor');
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className={styles.page}>
            <Navbar />

            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Login Administrativo</h2>

                        {notification && (
                            <div className={styles.notification}>
                                {notification}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder=" "
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                                <label className={styles.label}>Correo</label>

                            </div>
                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    placeholder=" "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                                <label className={styles.label}>Contraseña</label>
                            </div>

                            <button type="submit" className={styles.button}>
                                Ingresar
                            </button>
                        </form>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default Login;
