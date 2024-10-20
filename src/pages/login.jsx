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
        userRole: '',
        isEmailValid: true,
        isPasswordValid: true,
        isLoading: false,
        showPassword: false,
    }

    componentDidMount() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.setState({ isAuthenticated: true });
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                [name]: value
            },
            error: '',
            isEmailValid: name === 'email' ? this.validateEmail(value) : prevState.isEmailValid,
            isPasswordValid: name === 'password' ? this.validatePassword(value) : prevState.isPasswordValid
        }));
    }

    validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword = (password) => {
        return password.length >= 6; // Por ejemplo, al menos 6 caracteres
    }

    iniciarSesion = async (event) => {
        event.preventDefault();

        if (!this.state.isEmailValid || !this.state.isPasswordValid) {
            this.setState({ error: 'Por favor corrige los errores en el formulario' });
            return;
        }

        this.setState({ isLoading: true });

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
                this.setState({ error: 'Correo electrónico o contraseña incorrectos', isLoading: false });
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            this.setState({ error: 'Error al intentar iniciar sesión', isLoading: false });
        }
    }

    togglePasswordVisibility = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    }

    render() {
        const { isEmailValid, isPasswordValid, form, isLoading, showPassword } = this.state;
        const isFormValid = isEmailValid && isPasswordValid;

        if (this.state.isAuthenticated && this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        return (
            <div>
                <Navbar />
                <div className='n'>
                    <div className="form-container">
                        <img src={logo} alt="Logo" className="logo" />
                        <h2>Iniciar Sesión</h2>
                        <form onSubmit={this.iniciarSesion} autoComplete="off">
                            <div className="input-group">
                                <label htmlFor="email">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    value={form.email}
                                    onChange={this.handleChange}
                                    required
                                    className={isEmailValid ? 'valid' : 'invalid'}
                                />
                                {!isEmailValid && <p className="error">Ingrese un correo electrónico válido.</p>}
                            </div>
                            <div className="input-group password-container">
                                <label htmlFor="password">Contraseña:</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Ingrese su contraseña"
                                    value={form.password}
                                    onChange={this.handleChange}
                                    required
                                    className={isPasswordValid ? 'valid' : 'invalid'}
                                />
                                <button 
                                    type="button"
                                    onClick={this.togglePasswordVisibility}
                                    className="eye-button"
                                >
                                    <i className={showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                </button>
                                {!isPasswordValid && <p className="error">La contraseña debe tener al menos 8 caracteres.</p>}
                            </div>
                            {this.state.error && <p className="error">{this.state.error}</p>}
                            <div className="btn-enter">
                            <button type="submit" className="btn" disabled={!isFormValid || isLoading}>
                                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>
                            </div>
                            <p><Link to="/recover-password">¿Olvidaste tu contraseña?</Link></p>
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