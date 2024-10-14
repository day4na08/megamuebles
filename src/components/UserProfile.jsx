import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserProfile.css';

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Estado para manejar errores

    const userId = localStorage.getItem('userId'); // Obtener el userId de localStorage

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError('No se encontró el ID de usuario.');
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:3001/users/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                setError('Hubo un problema al obtener los datos del usuario.'); // Guardar el error en el estado
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, [userId]);
    
    // Manejo de estados de carga, error y datos
    if (loading) {
        return <p>Cargando...</p>; // Mensaje de carga
    }

    if (error) {
        return <p>{error}</p>; // Mensaje de error
    }

    if (!userData) {
        return <p>No se encontraron datos de usuario.</p>; // Manejo si no hay datos
    }

    return (
        <div className="container">
            <h2>Bienvenido, ¡{userData.username}!</h2>
            <h4>¿Qué necesitas hoy?</h4>
            <p>Apellido: {userData.apellido}</p>
            <p>Email: {userData.email}</p>
            <hr />
            <h3>Actualice sus números de contacto aquí!</h3>
            {/* Aquí puedes agregar más opciones para editar o actualizar información del usuario */}
        </div>
    );
}

export default UserProfile;
