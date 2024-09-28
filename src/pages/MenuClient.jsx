import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class ClientMenu extends Component {
    state = {
        redirect: null // Estado para manejar la redirección
    };

    componentDidMount() {
        const role = cookies.get('role');
        const username = cookies.get('username');

        if (!username) {
            // Si no hay usuario logueado, redirige a la página de inicio
            this.setState({ redirect: '/' });
        } else if (role !== 'Cliente') {
            // Si el rol no es Cliente, redirige a la página de inicio o a otra página relevante
            this.setState({ redirect: '/' });
        }
    }

    cerrarSesion = () => {
        cookies.remove('id', { path: "/" });
        cookies.remove('username', { path: "/" });
        cookies.remove('email', { path: "/" });
        cookies.remove('role', { path: "/" });
        window.location.href = '/';
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        return (
            <div>
                <h2>Menú del Cliente</h2>
                <div>
                    <ul>
                        <li><Link to="/profile">Perfil</Link></li>
                        <li><Link to="/orders">Mis Pedidos</Link></li>
                        <li><Link to="/products">Productos</Link></li>
                        <li><Link to="/cart">Carrito</Link></li>
                    </ul>
                </div>
                <button onClick={this.cerrarSesion}>
                    Cerrar sesión
                </button>
            </div>
        );
    }
}
