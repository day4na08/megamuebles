import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductCrud = () => {
    const initialProductData = {
        name: '',
        material: '',
        estilo: '',
        tela: '',
        acabado: '',
        color: '',
        tapizMaterial: '',
        materialInterno: '',
        precio: '',
        descripcion: '',
        requiereArmado: '',
        alto: '',
        ancho: '',
        profundidad: '',
        pesoNeto: '',
        cantidad: '',
        autor: '',
        userId: 1, // ID de usuario por defecto
        imagen1: '',
        imagen2: '',
        imagen3: '',
        imagen4: '',
        imagen5: ''
    };

    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState(initialProductData);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/productos');
            setProducts(response.data);
            setError('');
        } catch (error) {
            setError('Error al cargar los productos: ' + (error.response?.data || error.message));
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!productData.name || !productData.precio || !productData.cantidad) {
            setError('Por favor complete los campos obligatorios (nombre, precio y cantidad)');
            return false;
        }
        return true;
    };

const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        
        try {
            const formData = {
                ...productData,
                precio: parseFloat(productData.precio) || 0,
                alto: parseFloat(productData.alto) || null,
                ancho: parseFloat(productData.ancho) || null,
                profundidad: parseFloat(productData.profundidad) || null,
                pesoNeto: parseFloat(productData.pesoNeto) || null,
                cantidad: parseInt(productData.cantidad) || 0
            };

            if (editingProduct) {
                await axios.put(`http://localhost:3001/api/productos/${editingProduct.id}`, formData);
            } else {
                await axios.post('http://localhost:3001/api/productos', formData);
            }
            
            await fetchProducts();
            setProductData(initialProductData);
            setEditingProduct(null);
            setError('');
        } catch (error) {
            setError('Error al ' + (editingProduct ? 'actualizar' : 'agregar') + 
                    ' producto: ' + (error.response?.data || error.message));
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
<div className="container mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                        type="text"
                        name="name"
                        placeholder="Nombre *"
                        value={productData.name}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="material"
                        placeholder="Material"
                        value={productData.material}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="estilo"
                        placeholder="Estilo"
                        value={productData.estilo}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    />
                <input
                    type="text"
                    name="tela"
                    placeholder="Tela"
                    value={productData.tela}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="acabado"
                    placeholder="Acabado"
                    value={productData.acabado}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={productData.color}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="tapizMaterial"
                    placeholder="Material del tapiz"
                    value={productData.tapizMaterial}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="materialInterno"
                    placeholder="Material interno"
                    value={productData.materialInterno}
                    onChange={handleInputChange}
                />
                    <input
                        type="number"
                        name="precio"
                        placeholder="Precio *"
                        value={productData.precio}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                        step="0.01"
                    />
                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={productData.descripcion}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="requiereArmado"
                    placeholder="Requiere armado (sí/no)"
                    value={productData.requiereArmado}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="alto"
                    placeholder="Alto"
                    value={productData.alto}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="ancho"
                    placeholder="Ancho"
                    value={productData.ancho}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="profundidad"
                    placeholder="Profundidad"
                    value={productData.profundidad}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="pesoNeto"
                    placeholder="Peso neto"
                    value={productData.pesoNeto}
                    onChange={handleInputChange}
                />
                    <input
                        type="number"
                        name="cantidad"
                        placeholder="Cantidad *"
                        value={productData.cantidad}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    />
                <input
                    type="text"
                    name="autor"
                    placeholder="Autor"
                    value={productData.autor}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imagen1"
                    placeholder="URL Imagen 1"
                    value={productData.imagen1}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imagen2"
                    placeholder="URL Imagen 2"
                    value={productData.imagen2}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imagen3"
                    placeholder="URL Imagen 3"
                    value={productData.imagen3}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imagen4"
                    placeholder="URL Imagen 4"
                    value={productData.imagen4}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imagen5"
                    placeholder="URL Imagen 5"
                    value={productData.imagen5}
                    onChange={handleInputChange}
                />
                 </div>

<div className="flex gap-2">
    <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
    >
        {loading ? 'Procesando...' : (editingProduct ? 'Actualizar' : 'Agregar')}
    </button>
    
    {editingProduct && (
        <button 
            type="button"
            onClick={() => {
                setEditingProduct(null);
                setProductData(initialProductData);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
        >
            Cancelar
        </button>
    )}
</div>
</form>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{products.map((product) => (
    <div key={product.id} className="border p-4 rounded shadow">
        <h3 className="font-bold">{product.name}</h3>
        <p>Precio: ${product.precio}</p>
        <p>Cantidad: {product.cantidad}</p>
        {/* Puedes agregar más campos aquí */}
    </div>
))}
</div>
</div>
);
};

export default ProductCrud;