//Importamos React y los hooks básicos
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import styles from './Inicio.module.css';  //Importamos el archivo de estilos
import xcaret from '../assets/xcaret.png';

// Se crea un componente funcional
function Inicio() {
    return (
        <div className={styles.page}>
            {/* Se importa la navegación */}
            <Navbar />

            <div className={styles.content}>
                {/* Contenido principal */}
                <main className={styles.main}>
                    <h1 className={styles.title}>Bienvenidos al portal de Xhaves</h1>
                    <img src={xcaret} alt="Xcaret" className={styles.image}></img>
                </main>
                {/* Se importa el footer */}
                <Footer />
            </div>
        </div>

    );
}

//Exportamos el componente para usar el otro archivo
export default Inicio;