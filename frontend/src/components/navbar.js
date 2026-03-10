import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import styles from "./navbar.module.css";

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setVisible(false); // ocultar al hacer scroll hacia abajo
            } else {
                setVisible(true);  // mostrar al hacer scroll hacia arriba
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`${styles.navbar} ${!visible ? styles.hidden : ""}`}>
            <div className={styles.logo}>
                <Link to={isLoggedIn ? "/admin/home" : "/"} className={styles.logoLink}>
                    Xhaves
                </Link>
            </div>

            <nav className={styles.navLinks}>
                {isLoggedIn ? (
                    <>
                        <Link to="/admin/home" className={styles.link}>Inicio</Link>
                        <Link to="/registroPrestamo" className={styles.link}>Registro de llaves</Link>
                        <button onClick={logout} className={styles.logoutBtn}>Cerrar sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/prestamoLlave" className={styles.link}>Solicitar llave</Link>
                        <Link to="/registroPrestamo" className={styles.link}>Registro de llaves</Link>
                        <Link to="/llavesPrestadas" className={styles.link}>Llaves prestadas</Link>
                        <Link to="/login" className={styles.link}>Iniciar sesión</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
