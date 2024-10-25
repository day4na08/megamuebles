import React, { useState } from 'react';
import Filtros from '../components/Catalogo/Filtros';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import Resultados from '../components/Catalogo/Resultados';

const Catalog = () => {
    const [filtros, setFiltros] = useState({
        categoria: '',
        estilo: '',
        tela: '',
        acabado: '',
        color: '',
        tapizMaterial: '',
        materialInterno: '',
        minPrecio: 0,
        maxPrecio: 1000000,
    });

    return (
        <div>
            <NavBar />
            <div className="catalog">
                <h1>Catálogo de Muebles</h1>
                <div className="catalogo-container">
                    <div className="filterPM">
                        <Filtros filtros={filtros} setFiltros={setFiltros} />
                    </div>
                    <div className="filterRP">
                        <Resultados filtros={filtros} />
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx>{`
                .catalog {
                    margin-top: 5pc;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    padding-left: 30px;
                    align-items: flex-start;
                }

                .catalogo-container {
                    display: flex;
                    margin: -50px 100px;
                    max-width: 1900px;
                    width: 100%;
                    flex-grow: 8; /* Permite que el contenedor crezca para llenar el espacio */
                    padding-bottom: 210px; /* Espacio para evitar superposición con el footer */
                }

                .filterPM {
                    flex: 0 0 250px;
                }

                .filterRP {
                    flex: 1;
                    margin-left: 80px;
                    display: flex;
                    flex-wrap: wrap; /* Permitir que las tarjetas se ajusten */
                }

                .card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* Asegura que el contenido y los botones se separen */
                    border: 1px solid #ccc; /* Ejemplo de borde */
                    border-radius: 8px; /* Bordes redondeados */
                    margin: 20px; /* Espacio entre las tarjetas */
                    padding: 30px; /* Espacio interno de la tarjeta */
                    width: 300px; /* Ancho fijo para las tarjetas */
                    height: 400px; /* Altura fija para las tarjetas */
                }

                .card-content {
                    flex-grow: 1; /* Permite que el contenido ocupe el espacio disponible */
                }

                .card-buttons {
                    display: flex;
                    justify-content: space-between; /* Espacio entre botones */
                }

                h1 {
                    text-align: center;
                    margin: 60px 1px;
                    padding-left: 978px;
                    font-family: 'Montserrat', sans-serif; /* Cambiado a Montserrat */
                    font-weight: 700; /* Peso de la fuente */
                    font-size: 2.8em; 
                    text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
                }

                .navbar {
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
};

export default Catalog;
