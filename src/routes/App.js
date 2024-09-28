import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../pages/login.jsx";
import Menu from "../pages/menu";
import Register from "../pages/register";
import AdminMenu from "../pages/MenuADMIN";
import ClientMenu from "../pages/MenuClient";
import NavBar from "../components/Navbar";
import Catalog from "../pages/Catalogo";
import ProductDetail from "../pages/ProductDetail";
import { CartProvider } from '../components/CartContext.jsx'
import Carrito from "../pages/carrito.jsx";
import AccountSettings from "../pages/AccountSettings.jsx";
import Index from "../pages/Index.jsx";
import ProductCrud from '../components/ProductCrud'
import AdminPage from "../pages/Admin.jsx";
import UserPage from "../pages/User.jsx";
import UserCartFavorites from "../components/UserCartFavorites.jsx";
import About from '../components/About.jsx';
import Spline from "@splinetool/react-spline";


function App() {
  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/AdminMenu" element={<AdminMenu />} />
        <Route path="/ClientMenu" element={<ClientMenu />} />
        <Route path="/NavBar" element={<NavBar />} />
        <Route path="/Catalog" element={<Catalog />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />        
        <Route path="/Carrito" element={<Carrito />} />
        <Route path="/AccountSettings" element={<AccountSettings />} />
        <Route path="/" element={<Index />} />
        <Route path="/ProductCrud" element={<ProductCrud />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/UserCartFavorites" element={<UserCartFavorites/>} />
        <Route path="/about" element={<About />} />


















      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;

