import React from "react";
import styles from "./adminHome.module.css";
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";

function AdminHome() {
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.content}>
                <main className={styles.main}>
                    <h2 className={styles.title}> Panel de inicio </h2>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}> Agregar llaves </h3>
                            <p className={styles.cardText}>
                                Registra nuevas llaves disponibles.
                            </p>
                            <Link to="/admin/dashboard" className={styles.button}> 
                                Ir a registro
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}> Dar de alta responsables </h3>
                            <p className={styles.cardText}>
                                Agrega responsables que podrán prestar y manejar llaves.
                            </p>
                            <Link to="/admin/responsables" className={styles.button}> 
                                Ir a responsables
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}> Registro de llaves </h3>
                            <p className={styles.cardText}>
                                Consulta el listado de llaves que se han prestado.
                            </p>
                            <Link to="/admin/registroPrestamoAdmin" className={styles.button}> 
                                Ir a responsables
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default AdminHome;