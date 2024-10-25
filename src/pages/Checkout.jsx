import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../components/CartContext.jsx';
import Cookies from 'universal-cookie';
import '../css/FormularioCompra.css';

const CheckoutForm = ({ onPurchaseComplete }) => {
    const cookies = new Cookies();
    const { cartItems, setCartItems } = useContext(CartContext);
    const [userData, setUserData] = useState({
        IdUser: '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        tarjeta: '',
        vencimiento: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);
    const [cardError, setCardError] = useState('');
    const [cvvError, setCvvError] = useState('');

    useEffect(() => {
        const userId = cookies.get('id');
        if (userId) {
            axios.get(`http://localhost:3001/users/${userId}`)
                .then(response => {
                    const user = response.data;
                    setUserData({
                        IdUser: user.id,
                        nombre: `${user.username}`,
                        email: user.email,
                        telefono: user.telefonos?.telefono1 || '',
                        direccion: user.direcciones?.direccion1 || '',
                        ciudad: '',
                        codigoPostal: '',
                        tarjeta: user.tarjetasDeCredito?.tarjeta1?.numero || '',
                        vencimiento: user.tarjetasDeCredito?.tarjeta1?.fechaVencimiento || '',
                        cvv: user.tarjetasDeCredito?.tarjeta1?.codigoSeguridad || ''
                    });
                })
                .catch(error => {
                    console.error('Error al obtener datos del usuario:', error);
                });
        }
    }, []);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
        setCardError(''); // Limpiar el error de tarjeta al cambiar el valor
        setCvvError(''); // Limpiar el error de CVV al cambiar el valor
    };

    const validateCard = (cardNumber) => {
        const cleaned = cardNumber.replace(/\D/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) {
            return 'El número de tarjeta debe tener entre 13 y 19 dígitos.';
        }
        if (!/^\d+$/.test(cleaned)) {
            return 'El número de tarjeta solo debe contener dígitos.';
        }
        return '';
    };

    const validateCvv = (cvv) => {
        const cleaned = cvv.replace(/\D/g, '');
        if (cleaned.length !== 3) {
            return 'El CVV debe tener exactamente 3 dígitos.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validar tarjeta y CVV antes de continuar
        const cardValidationError = validateCard(userData.tarjeta);
        const cvvValidationError = validateCvv(userData.cvv);
        
        if (cardValidationError) {
            setCardError(cardValidationError);
            setLoading(false);
            return;
        }
        if (cvvValidationError) {
            setCvvError(cvvValidationError);
            setLoading(false);
            return;
        }

        try {
            if (cartItems.length === 0) {
                alert('El carrito está vacío. Por favor, agrega productos antes de comprar.');
                setLoading(false);
                return;
            }

            for (let item of cartItems) {
                const response = await axios.get(`http://localhost:3001/products/${item.id}`);
                const productoApi = response.data;
                if (item.quantity > productoApi.cantidad) {
                    alert(`No hay suficientes unidades de ${item.nombre}. Quedan ${productoApi.cantidad} unidades disponibles.`);
                    setLoading(false);
                    return;
                }
            }

            const productsData = await Promise.all(cartItems.map(async (item, index) => {
                const response = await axios.get(`http://localhost:3001/products/${item.id}`);
                const productoApi = response.data;
                return {
                    [`product${index + 1}`]: {
                        productId: item.id,
                        nombre: productoApi.nombre,
                        cantidad: item.quantity,
                        precio: productoApi.precio,
                        userId: productoApi.userId,
                        autor: productoApi.autor
                    }
                };
            }));

            const purchaseData = {
                user: userData,
                products: Object.assign({}, ...productsData)
            };

            await axios.post('http://localhost:3001/purchases', purchaseData);

            await Promise.all(cartItems.map(async (item) => {
                const response = await axios.get(`http://localhost:3001/products/${item.id}`);
                const productoApi = response.data;
                const productoActualizado = {
                    ...productoApi,
                    cantidad: productoApi.cantidad - item.quantity
                };
                await axios.put(`http://localhost:3001/products/${item.id}`, productoActualizado);
            }));

            alert('Compra realizada con éxito');
            setCartItems([]);
            onPurchaseComplete(purchaseData);
        } catch (error) {
            console.error('Error al realizar la compra:', error.response ? error.response.data : error.message);
            alert('Hubo un error al completar la compra. Verifica la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="checkout-form" onSubmit={handleSubmit} autoComplete="off">
            <h2>Detalles de la Compra</h2>
            <div className="form-group">
                <label>Nombre Completo:</label>
                <input
                    type="text"
                    name="nombre"
                    value={userData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                />
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Tu correo electrónico"
                    required
                />
            </div>
            <div className="form-group">
                <label>Teléfono:</label>
                <input
                    type="tel"
                    name="telefono"
                    value={userData.telefono}
                    onChange={handleChange}
                    placeholder="Su número de teléfono"
                    required
                />
            </div>
            <div className="form-group">
                <label>Ciudad:</label>
                <input
                    type="text"
                    name="ciudad"
                    value={userData.ciudad}
                    onChange={handleChange}
                    placeholder="Ciudad"
                    required
                />
            </div>
            <div className="form-group">
                <label>Codigo Postal:</label>
                <input
                    type="text"
                    name="codigoPostal"
                    value={userData.codigoPostal}
                    onChange={handleChange}
                    placeholder="Su codigo postal"
                    required
                />
            </div>
            <div className="form-group">
                <label>Dirección:</label>
                <input
                    type="text"
                    name="direccion"
                    value={userData.direccion}
                    onChange={handleChange}
                    placeholder="Su dirección de envío"
                    required
                />
            </div>
            <div className="form-group">
                <label>Tarjeta de Crédito:</label>
                <input
                    type="text"
                    name="tarjeta"
                    value={userData.tarjeta}
                    onChange={handleChange}
                    placeholder="Número de la tarjeta"
                    required
                    pattern="\d*" // Acepta solo dígitos
                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Evita escribir letras
                />
                {cardError && <div className="error">{cardError}</div>} {/* Mensaje de error de tarjeta */}
            </div>
            <div className="form-group">
                <label>Fecha de Vencimiento:</label>
                <input
                    type="text"
                    name="vencimiento"
                    value={userData.vencimiento}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    required
                />
            </div>
            <div className="form-group">
                <label>CVV:</label>
                <input
                    type="text"
                    name="cvv"
                    value={userData.cvv}
                    onChange={handleChange}
                    placeholder="Código CVV"
                    required
                    maxLength={3} // Máximo 3 dígitos
                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Evita escribir letras
                />
                {cvvError && <div className="error">{cvvError}</div>} {/* Mensaje de error de CVV */}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar Compra'}
            </button>
        </form>
    );
};

export default CheckoutForm;

   

  
