import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import styles from "./navbar.module.css";

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setVisible(false);
            } else {
                setVisible(true);
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

            {/* Botón hamburguesa */}
            <div
                className={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <nav className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
                {isLoggedIn ? (
                    <>
                        <Link to="/admin/home" className={styles.link}>Inicio</Link>
                        <Link to="/llavesPrestadas" className={styles.link}>Llaves Prestadas</Link>
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
