import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Search from './search';
import MinNav from './minNav';
import '../css/Navbar.css';
import AccountDropdown from './user/AccountDropdown';
import { CartContext } from './CartContext'; // Asegúrate de que esta ruta sea correcta
import LogoutButton from './user/LogoutButton';
import UserCartFavorites from './UserCartFavorites';


const cookies = new Cookies();

const NavBar = () => {
    const { cartCount } = useContext(CartContext); // Obtenemos la cantidad de productos en el carrito
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
         await axios.get('http://localhost:3001/products');
          // Maneja los productos si es necesario
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
  
      // Verifica el estado de la sesión
      const id = cookies.get('id');
      const role = cookies.get('role');
      if (id && role) {
        setIsLoggedIn(true);
        setUserRole(role);
      }
    }, []);
  
    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeOverlay = () => {
      setIsNavOpen(false);
      setIsCartOpen(false);
    };
  
    const handleAccountClick = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const handleAccountRedirect = () => {
      navigate('/user'); // Redirige a la página de cuenta del usuario
    };
  
    const handleLogout = () => {
      // Limpia las cookies
      cookies.remove('id', { path: '/' });
      cookies.remove('username', { path: '/' });
      cookies.remove('email', { path: '/' });
      cookies.remove('role', { path: '/' });
  
      // Actualiza el estado
      setIsLoggedIn(false);
      setUserRole('');
  
      // Cierra el dropdown
      setIsDropdownOpen(false);
  
      // Redirige a la página de inicio
      navigate('/');
    };
  
    return (
        <>
        <nav className={isNavOpen ? 'open' : ''}>
            <div className="container">
                <div className="nav-wrapper">
                    <div className="logo">
                        <i className="bx bx-menu menu-icon" onClick={toggleNav}></i>
                        <span className="logoform">
                            <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                                <line id="line1" x1="150" y1="31.1" x2="100" y2="56.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line2" x1="100" y1="56.1" x2="50" y2="31.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line3" x1="50" y1="31.1" x2="100" y2="6.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line4" x1="100" y1="6.1" x2="150" y2="31.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line5" x1="100" y1="56.1" x2="100" y2="100" stroke="#ffffff" strokeWidth="6" />
                                <line id="line6" x1="50" y1="31.1" x2="50" y2="131.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line7" x1="150" y1="31.1" x2="150" y2="131.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line8" x1="50" y1="131.1" x2="100" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line9" x1="150" y1="131.1" x2="100" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line10" x1="50" y1="131.1" x2="20" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line11" x1="150" y1="131.1" x2="180" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line12" x1="20" y1="161.1" x2="100" y2="211.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line13" x1="180" y1="161.1" x2="100" y2="211.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line14" x1="20" y1="161.1" x2="20" y2="51.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line15" x1="180" y1="161.1" x2="180" y2="51.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line16" x1="20" y1="50" x2="100" y2="101.1" stroke="#ffffff" strokeWidth="6" />
                                <line id="line17" x1="180" y1="51.1" x2="100" y2="101.1" stroke="#ffffff" strokeWidth="6" />
                            </svg>
                        </span>
                        <span className="logoname">MegaMuebles</span>
                    </div>

                 
                        <Search/>
                  
                    <ul className="list_nav">
                        <li className="list">
                            <Link to="#" className="nav-link">
                                <i className='bx bx-bell icon'></i>
                            </Link>
                        </li>
                      <li className="list">
                        <div className="nav-link" onClick={handleAccountClick}>
                          <i className="bx bx-user-circle icon">
                            <span className="link">Cuenta</span>
                          </i>
                        </div>
                        {isDropdownOpen && (
                          <AccountDropdown 
                            isLoggedIn={isLoggedIn} 
                            userRole={userRole} 
                            onLogout={handleLogout}
                          />
                        )}
                      </li>
                      <li className="list cart-icon">
                        <Link to="/Carrito" className="nav-link" onClick={toggleCart}>
                          <i className="bx bxs-cart cart-icon icon" />
                          <span>{cartCount}</span>
                        </Link>
                      </li>
                    </ul>
                  
                </div>
            </div>

            <div className={`sidebar ${isNavOpen ? 'open' : ''}`}>
                <div className="logo">
                    <i className='bx bx-menu menu-icon' onClick={toggleNav}></i>
                    <span className="logoform">
                        <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                            <line id="line1" x1="150" y1="31.1" x2="100" y2="56.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line2" x1="100" y1="56.1" x2="50" y2="31.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line3" x1="50" y1="31.1" x2="100" y2="6.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line4" x1="100" y1="6.1" x2="150" y2="31.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line5" x1="100" y1="56.1" x2="100" y2="100" stroke="#ffffff" strokeWidth="6" />
                            <line id="line6" x1="50" y1="31.1" x2="50" y2="131.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line7" x1="150" y1="31.1" x2="150" y2="131.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line8" x1="50" y1="131.1" x2="100" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line9" x1="150" y1="131.1" x2="100" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line10" x1="50" y1="131.1" x2="20" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line11" x1="150" y1="131.1" x2="180" y2="161.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line12" x1="20" y1="161.1" x2="100" y2="211.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line13" x1="180" y1="161.1" x2="100" y2="211.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line14" x1="20" y1="161.1" x2="20" y2="51.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line15" x1="180" y1="161.1" x2="180" y2="51.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line16" x1="20" y1="50" x2="100" y2="101.1" stroke="#ffffff" strokeWidth="6" />
                            <line id="line17" x1="180" y1="51.1" x2="100" y2="101.1" stroke="#ffffff" strokeWidth="6" />
                        </svg>
                    </span>
                    <span className="logoname">MegaMuebles</span>
                </div>
                <div className="sidebar-content">
                    <ul className="lists">
                        <li className="list">
                            <Link to="/" className="nav-link">
                                <i className='bx bx-home-alt icon'></i>
                                <span className="link">Inicio</span>
                            </Link>
                        </li>
                        <li className="list">
                            <Link to="/Catalog" className="nav-link">
                                <i className='bx bx-store icon'></i>
                                <span className="link">Catalogo</span>
                            </Link>
                        </li>
                        <li className="list">
                            {isLoggedIn ? (
                              <div className="nav-link" onClick={handleAccountRedirect}>
                                <i className="bx bx-user-circle icon">
                                  <span className="link"> Cuenta</span>
                                </i>
                              </div>
                            ) : (
                              <Link className="nav-link" to="/Login">
                                <i className="bx bx-user-circle icon">
                                  <span className="link"> Iniciar Sesión</span>
                                </i>
                              </Link>
                            )}
                          </li>
                        <li className="list">
                            <Link to="/UserCartFavorites" className="nav-link">
                                <i className='bx bx-heart icon'></i>
                                <span className="link">Favoritos</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="bottom-cotent">
                        <ul className="lists">
                            <li className="list">
                                <Link to="/AccountSettings" className="nav-link">
                                    <i className='bx bx-cog icon'></i>
                                    <span className="link">Configuraciones</span>
                                </Link>
                            </li>
                            <li className="list">
                              <LogoutButton/>
                          </li>
                        </ul>
                    </div>
                </div>
            </div>
            <section className={`overlay ${isNavOpen ? 'visible' : ''}`} onClick={closeOverlay}></section>
        </nav>
        <MinNav/>
        </>
    );
};

export default NavBar;
