import React, { useState } from 'react';
import Filtros from '../components/Catalogo/Filtros';
import '../css/catalogo.css';
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
            <div className="filter RP">
                <Resultados filtros={filtros} />
                </div>
            </div>

            </div>
        <Footer />
        </div>
    );
};

export default Catalog;
