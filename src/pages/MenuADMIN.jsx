import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Navigate, Link, } from 'react-router-dom';
import NavBar from '../components/Navbar';

const cookies = new Cookies();

export default class AdminMenu extends Component {

    cerrarSesion = () => {
        cookies.remove('id', { path: "/" });
        cookies.remove('username', { path: "/" });
        cookies.remove('apellidos', { path: "/" });
        cookies.remove('email', { path: "/" });
        cookies.remove('role', { path: "/" });
        window.location.href = '/'; // Redirige al inicio de sesión
    }

    render() {
        const userRole = cookies.get('role');
        const username = cookies.get('username');

        if (!username || userRole !== 'Administrador') {
            return <Navigate to="/" />; // Redirige si no está logueado o no es admin
        }

        return (
            <div>
                <NavBar></NavBar>

                <h2>Menú Administrador</h2>

                    <ul>
                        <li><Link to="/admin/users">Gestión de Usuarios</Link></li>
                        <li><Link to="/admin/products">Gestión de Productos</Link></li>
                        <li><Link to="/admin/orders">Órdenes</Link></li>
                        <li><Link to="/admin/reports">Informes</Link></li>
                    </ul>
 
                <br />
                <button onClick={this.cerrarSesion}>
                    Cerrar sesión
                </button>
            </div>
        );
    }
}
