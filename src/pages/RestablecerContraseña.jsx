import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function RestablecerContraseña() {
  const { token } = useParams();
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await fetch(`http://localhost:3002/restablecer/${token}`);
        if (!response.ok) throw new Error('Token inválido o expirado');
        setMensaje('Token válido. Puede establecer una nueva contraseña.');
        setMensajeTipo('success');
        setTokenValido(true);
      } catch (error) {
        setMensaje(error.message);
        setMensajeTipo('error');
        setTokenValido(false);
      }
    };

    verificarToken();
  }, [token]);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Validación de longitud de la nueva contraseña
    if (nuevaContraseña.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      setMensajeTipo('error');
      mostrarMensaje();
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setMensaje('Las contraseñas no coinciden.');
      setMensajeTipo('error');
      mostrarMensaje();
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/restablecer/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaContraseña }),
      });

      if (!response.ok) throw new Error('Error al restablecer la contraseña.');
      setMensaje('Contraseña restablecida con éxito.');
      setMensajeTipo('success');

      // Redirigir a la página de login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMensaje(error.message);
      setMensajeTipo('error');
    }

    mostrarMensaje();
  };

  const mostrarMensaje = () => {
    setTimeout(() => {
      setMensaje('');
      setMensajeTipo('');
    }, 5000);
  };

  // Estilos en objeto
  const estilos = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    },
    contenedor: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center',
      margin: 'auto',
      flexGrow: 1, // Permite que el contenedor crezca y empuje el footer hacia abajo
    },
    titulo: {
      marginBottom: '20px',
      color: '#333',
      fontSize: '28px',
      fontWeight: '700',
    },
    input: {
      width: '100%',
      borderRadius: '10px',
      padding: '14px',
      border: '2px solid #007bff',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
      marginBottom: '20px',
    },
    boton: {
      color: '#ffffff',
      backgroundColor: '#0056b3',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s, color 0.3s',
    },
    mensajeError: {
      color: 'red',
      marginTop: '10px',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={estilos.body}>
      <Navbar /> {/* Agregando la barra de navegación */}
      <div style={estilos.contenedor}>
        <h1 style={estilos.titulo}>Restablecer Contraseña</h1>
        {mensaje && (
          <div className={`notification ${mensajeTipo}`} data-id={`restablecerContraseña.${mensajeTipo}`}>
            {mensaje}
          </div>
        )}
        {tokenValido && (
          <form className="restablecer-contraseña-formulario" onSubmit={manejarSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              required
              style={estilos.input}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              required
              style={estilos.input}
            />
            <button type="submit" style={estilos.boton}>Restablecer Contraseña</button>
          </form>
        )}
      </div>
      <Footer /> {/* Agregando el footer */}
    </div>
  );
}

export default RestablecerContraseña;
