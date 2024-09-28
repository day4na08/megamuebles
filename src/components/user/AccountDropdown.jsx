import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AccountDropdown.css'; // Asegúrate de tener los estilos necesarios

const AccountDropdown = ({ isLoggedIn, userRole, onLogout }) => {
  return (
    <div className="account-dropdown">
      {isLoggedIn ? (
        <ul>
          <li>
            <Link to={userRole === 'admin' ? '/admin' : '/user'}>Mi Cuenta</Link>
          </li>
          <li>
            <Link to="/login" onClick={onLogout}>Cerrar Sesión</Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/Login">Iniciar Sesión</Link>
          </li>
          <li>
            <Link to="/Register ">Registrarse</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default AccountDropdown;
