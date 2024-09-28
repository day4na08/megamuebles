import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';
import '../css/logreg.css';
import Cookies from 'universal-cookie';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import logo from '../images/logo-small.png'; // Asegúrate de que la ruta sea correcta

const baseUrl = "http://localhost:3001/users";
const cookies = new Cookies();

class Login extends Component {
    state = {
        form: {
            email: '',
            password: ''
        },
        error: '',
        redirect: null,
        isAuthenticated: false,
        userRole: ''
    }

    componentDidMount() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.setState({ isAuthenticated: true });
        }
    }

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    iniciarSesion = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(baseUrl, {
                params: {
                    email: this.state.form.email,
                    password: md5(this.state.form.password)
                }
            });

            const usuarios = response.data;
            const usuario = usuarios.find(u => 
                (u.email === this.state.form.email || u.correo === this.state.form.email) &&
                (u.password === md5(this.state.form.password) || u.contraseña === md5(this.state.form.password))
            );

            if (usuario) {
                cookies.set('id', usuario.id, { path: "/" });
                cookies.set('username', usuario.username, { path: "/" });
                cookies.set('email', usuario.email || usuario.correo, { path: "/" });
                cookies.set('role', usuario.role || usuario.role, { path: "/" });

                localStorage.setItem('userId', usuario.id.toString());

                let redirectPath = '/user'; 
                if (usuario.role === 'admin') {
                    redirectPath = '/admin'; 
                }

                this.setState({ isAuthenticated: true, redirect: redirectPath, userRole: usuario.role });
            } else {
                this.setState({ error: 'Correo electrónico o contraseña incorrectos' });
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            this.setState({ error: 'Error al intentar iniciar sesión' });
        }
    }

    render() {
        if (this.state.isAuthenticated && this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        return (
            <div>
                <Navbar />
                <div className='n'>
                    <div className="form-container">
                        <img src={logo} alt="Logo" className="logo" /> {/* Logo agregado */}
                        <h2>Iniciar Sesión</h2>
                        <form onSubmit={this.iniciarSesion} autoComplete="off">
                            <div className="input-group">
                                <label htmlFor="email">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={this.state.form.email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={this.state.form.password}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            {this.state.error && <p className="error">{this.state.error}</p>}
                            <button type="submit" className="btn">Iniciar Sesión</button> {/* Clases unificadas */}
                        </form>
                        <p>¿No tienes una cuenta? <Link to="/Register">Regístrate aquí</Link></p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Login;
