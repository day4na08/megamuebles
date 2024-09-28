import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserProfile.css'

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [editMode, setEditMode] = useState({ type: null, index: null });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No se encontró ID de usuario');
        }

        const response = await axios.get(`http://localhost:3001/users/${userId}`);
        const data = response.data;

        if (!data) {
          throw new Error('No se encontraron datos del usuario');
        }

        setUserData({
          ...data,
          tarjetasDeCredito: data.tarjetasDeCredito || [],
          telefonos: data.telefonos || {},
          direcciones: data.direcciones || {}
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async (updatedData) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró ID de usuario');
      }
      await axios.put(`http://localhost:3001/users/${userId}`, updatedData);
      setUserData(updatedData);
      alert('Datos actualizados exitosamente');
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert('Hubo un problema al actualizar los datos. Por favor, inténtelo de nuevo.');
    }
  };

  const handleAddPhone = () => {
    if (!newPhone) {
      alert('Por favor, ingrese un número de teléfono.');
      return;
    }

    const phoneKey = `telefono${Object.keys(userData.telefonos).length + 1}`;
    const updatedPhones = { ...userData.telefonos, [phoneKey]: newPhone };
    handleSaveChanges({ ...userData, telefonos: updatedPhones });

    setNewPhone('');
    setShowEditModal(false);
  };

  const handleAddAddress = () => {
    if (!newAddress) {
      alert('Por favor, ingrese una dirección.');
      return;
    }

    const addressKey = `direccion${Object.keys(userData.direcciones).length + 1}`;
    const updatedAddresses = { ...userData.direcciones, [addressKey]: newAddress };
    handleSaveChanges({ ...userData, direcciones: updatedAddresses });

    setNewAddress('');
    setShowEditModal(false);
  };

  const handleEdit = (type, index) => {
    setEditMode({ type, index });

    if (type === 'phone') {
      setNewPhone(userData.telefonos[index]);
    } else if (type === 'address') {
      setNewAddress(userData.direcciones[index]);
    }

    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (editMode.type === 'phone') {
      const updatedPhones = { ...userData.telefonos, [`telefono${editMode.index + 1}`]: newPhone };
      handleSaveChanges({ ...userData, telefonos: updatedPhones });
    } else if (editMode.type === 'address') {
      const updatedAddresses = { ...userData.direcciones, [`direccion${editMode.index + 1}`]: newAddress };
      handleSaveChanges({ ...userData, direcciones: updatedAddresses });
    }

    setEditMode({ type: null, index: null });
    setNewPhone('');
    setNewAddress('');
    setShowEditModal(false);
  };

  const handleDelete = (type, index) => {
    if (type === 'phone') {
      const updatedPhones = Object.fromEntries(
        Object.entries(userData.telefonos).filter(([key]) => key !== `telefono${index + 1}`)
      );
      handleSaveChanges({ ...userData, telefonos: updatedPhones });
    } else if (type === 'address') {
      const updatedAddresses = Object.fromEntries(
        Object.entries(userData.direcciones).filter(([key]) => key !== `direccion${index + 1}`)
      );
      handleSaveChanges({ ...userData, direcciones: updatedAddresses });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <h2>Bienvenido ¡{userData.username}!</h2>
      <h4>Que necesitas hoy?</h4>
      <p>Apellido: {userData.apellido}</p>
      <p>Email: {userData.email}</p>
<hr />
      <h3>Actualice sus numeros de contacto aqui!</h3>
      <table>
        <thead>
          <tr>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userData.telefonos).map(([key, telefono], index) => (
            <tr key={index}>
              <td>{telefono}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit('phone', index)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete('phone', index)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="primary" onClick={() => { setEditMode({ type: 'phone', index: null }); setShowEditModal(true); }}>
        Agregar Teléfono
      </Button>
<hr />
      <h3>Direcciones</h3>
      <table>
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userData.direcciones).map(([key, direccion], index) => (
            <tr key={index}>
              <td>{direccion}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit('address', index)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete('address', index)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="primary" onClick={() => { setEditMode({ type: 'address', index: null }); setShowEditModal(true); }}>
        Agregar Dirección
      </Button>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode.type === 'phone' ? (editMode.index === null ? 'Agregar Teléfono' : 'Actualizar Teléfono') : (editMode.index === null ? 'Agregar Dirección' : 'Actualizar Dirección')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formInput">
              <Form.Label>{editMode.type === 'phone' ? 'Número de teléfono' : 'Dirección'}</Form.Label>
              <Form.Control
                type="text"
                placeholder={editMode.type === 'phone' ? 'Ingrese número de teléfono' : 'Ingrese dirección'}
                value={editMode.type === 'phone' ? newPhone : newAddress}
                onChange={(e) => editMode.type === 'phone' ? setNewPhone(e.target.value) : setNewAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editMode.index === null ? (editMode.type === 'phone' ? handleAddPhone : handleAddAddress) : handleUpdate}>
            {editMode.index === null ? (editMode.type === 'phone' ? 'Agregar Teléfono' : 'Agregar Dirección') : (editMode.type === 'phone' ? 'Actualizar Teléfono' : 'Actualizar Dirección')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
