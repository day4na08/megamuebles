import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import CreditCardTable from '../components/user/CreditCardTable';
import '../css/UserPage.css';
import NavBar from '../components/Navbar';
import Cookies from 'universal-cookie';
import Ventas from '../components/user/Ventas';
import Compras from '../components/user/Compras';
import ProductCrud from '../components/ProductCrud';

const cookies = new Cookies();

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = cookies.get('role');
    setUserRole(role);

    if (!userId || role !== 'user') {
      setIsAuthenticated(false); // Redirige si no está autenticado o si el rol no es "user"
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <UserProfile />;
      case 'cards':
        return <CreditCardTable />;
      case 'ventas':
        return <Ventas />;
        case 'compras':
          return <Compras />;
      case 'products':
        return <ProductCrud />;
      default:
        return <UserProfile />;
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/login'} />;
  }

  return (
    <div>
      <NavBar />
      <div className="user-page">
        <div className="sidebarpg">
          <ul>
            <li onClick={() => setActiveTab('info')}>Tu Información</li>
            <li onClick={() => setActiveTab('cards')}>Tus Tarjetas</li>
            <li onClick={() => setActiveTab('compras')}>Historial de Compras</li>
            <li onClick={() => setActiveTab('ventas')}>Historial de ventas</li>
            <li onClick={() => setActiveTab('products')}>Tus Productos</li>
          </ul>
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserPage;
