import React from 'react';
import { Link } from 'react-router-dom';
import '../css/minNav.css'; // Asegúrate de enlazar tu archivo de estilos

const minNav = () => {
    return (
        <div className="nv1">
            <ul className="itemsnv2">
                <li className="itemnv2">
                    <Link to="#" className="tooltip-link tooltip-trigger">MUEBLES</Link>   
                </li>
                <li className="itemnv2">
                    <Link to="#" className="tooltip-link tooltip-trigger">DECORACION</Link>   
                </li>
                <li className="itemnv2">
                    <Link to="#" className="tooltip-link tooltip-trigger">ACCESORIOS</Link>   
                </li>
                <li className="itemnv2">
                    <Link to="#" className="tooltip-link tooltip-trigger">ILUMINACION</Link>   
                </li>
                
            </ul>
        </div>
    );
}

export default minNav;
