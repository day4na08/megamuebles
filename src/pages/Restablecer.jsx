import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Restablecer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3002/restablecer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un enlace para restablecer tu contraseña.');
        setMessageType('success');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error al enviar el enlace. Intenta nuevamente.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error al enviar el enlace. Intenta nuevamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Asegura que ocupe toda la altura de la ventana
      backgroundColor: '#f0f8ff', // Color de fondo suave
      padding: '20px',
      boxSizing: 'border-box',
    },
    content: {
      flex: 1, // Permite que el contenido crezca y empuje el footer hacia abajo
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    formContainer: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '20px',
    },
    instructions: {
      marginBottom: '20px',
      color: '#666',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#555',
    },
    input: {
      width: '100%',
      borderRadius: '10px',
      padding: '14px',
      border: '2px solid #007bff',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#0056b3',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s, color 0.3s',
      marginTop: '20px',
    },
    notification: {
      marginTop: '20px',
      color: messageType === 'success' ? 'green' : 'red',
    },
    option: {
      marginTop: '15px',
      color: '#666',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Restablecer contraseña</h1>
          <p style={styles.instructions}>
            Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer la contraseña.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Dirección de correo electrónico"
                style={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'ENVIAR ENLACE PARA RESTABLECER'}
            </button>
          </form>

          {message && (
            <div style={styles.notification}>
              {message}
            </div>
          )}

          <p style={styles.option}>
            ¿No necesita restablecer tu contraseña? <a href="/login" style={styles.link}>Iniciar sesión.</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Restablecer;
