import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const ProductCrud = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
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
        autor: '',
        cantidad: '',
        imagenes: {
            imagen1: '',
            imagen2: '',
            imagen3: '',
            imagen4: '',
            imagen5: ''
        }
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const cookies = new Cookies();
    const userId = cookies.get('id');  // Get the logged-in user's ID
    const userName = cookies.get('username');  // Get the logged-in user's name

    // Fetch the products from the API
    useEffect(() => {
        fetchProducts();
    }, [userId]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/products?userId=${userId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: (name === 'cantidad' || name === 'precio') ? parseFloat(value) : value 
        }));
    };

    const handleImageChange = (e) => {
        setNewProduct(prevState => ({
            ...prevState,
            imagenes: {
                ...prevState.imagenes,
                [e.target.name]: e.target.value
            }
        }));
    };

    const addOrEditProduct = async () => {
        const productToAddOrEdit = {
            ...newProduct,
            userId,  // Assign the logged-in user's ID
            autor: userName  // Assign the logged-in user's name
        };

        try {
            if (isEditing) {
                // Update the product
                await axios.put(`http://localhost:3001/products/${editingId}`, productToAddOrEdit);
            } else {
                // Add a new product
                await axios.post('http://localhost:3001/products', productToAddOrEdit);
            }
            fetchProducts();
            setModalOpen(false);
            setIsEditing(false);
            setNewProduct({
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
                autor: '',
                cantidad: '',
                imagenes: {
                    imagen1: '',
                    imagen2: '',
                    imagen3: '',
                    imagen4: '',
                    imagen5: ''
                }
            });
        } catch (error) {
            console.error('Error adding/editing product:', error);
        }
    };

    const editProduct = (product) => {
        setNewProduct(product);
        setEditingId(product.id);
        setIsEditing(true);
        setModalOpen(true);
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/products/${id}`);
            fetchProducts(); // Update the product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    

    // Define the options for various fields
    const estiloOptions = ["", "Contemporáneo", "Rústico", "Moderno"];
    const telaOptions = ["", "Cuero", "Telabonita", "Lino"];
    const acabadoOptions = ["", "Cuero", "Aceite", "Liso", "Transparente", "Mate", "Brillante"];
    const colorOptions = ["", "Negro", "Madera", "Blanco", "Azul Marino", "Marrón"];
    const tapizMaterialOptions = ["", "Cuero", "Tela"];
    const materialInternoOptions = ["", "Triplex", "Contrachapado", "Espuma", "Metal"];

    return (
        <div className="container">
            <h1>Product CRUD</h1>

            <Button variant="primary" onClick={() => setModalOpen(true)}>
                Agregar Nuevo Producto
            </Button>

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Material</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td><img src={product.imagenes.imagen1} alt={product.name} style={{ width: '50px' }} /></td>
                            <td>{product.name}</td>
                            <td>{product.material}</td>
                            <td>{product.precio}</td>
                            <td>{product.cantidad}</td>
                            <td>
                                <Button variant="info" onClick={() => editProduct(product)}>Editar</Button>
                                <Button variant="danger" onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for adding/editing a product */}
            {modalOpen && (
                <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formMaterial">
                                <Form.Label>Material</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="material"
                                    value={newProduct.material}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEstilo">
                                <Form.Label>Estilo</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="estilo"
                                    value={newProduct.estilo}
                                    onChange={handleChange}
                                >
                                    {estiloOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formTela">
                                <Form.Label>Tela</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tela"
                                    value={newProduct.tela}
                                    onChange={handleChange}
                                >
                                    {telaOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formAcabado">
                                <Form.Label>Acabado</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="acabado"
                                    value={newProduct.acabado}
                                    onChange={handleChange}
                                >
                                    {acabadoOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formColor">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="color"
                                    value={newProduct.color}
                                    onChange={handleChange}
                                >
                                    {colorOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formTapizMaterial">
                                <Form.Label>Tapiz Material</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tapizMaterial"
                                    value={newProduct.tapizMaterial}
                                    onChange={handleChange}
                                >
                                    {tapizMaterialOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formMaterialInterno">
                                <Form.Label>Material Interno</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="materialInterno"
                                    value={newProduct.materialInterno}
                                    onChange={handleChange}
                                >
                                    {materialInternoOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formPrecio">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio"
                                    value={newProduct.precio}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDescripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descripcion"
                                    value={newProduct.descripcion}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRequiereArmado">
                                <Form.Label>Requiere Armado</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="requiereArmado"
                                    value={newProduct.requiereArmado}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAlto">
                                <Form.Label>Alto (cm)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="alto"
                                    value={newProduct.alto}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAncho">
                                <Form.Label>Ancho (cm)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="ancho"
                                    value={newProduct.ancho}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProfundidad">
                                <Form.Label>Profundidad (cm)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="profundidad"
                                    value={newProduct.profundidad}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPesoNeto">
                                <Form.Label>Peso Neto (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="pesoNeto"
                                    value={newProduct.pesoNeto}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCantidad">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cantidad"
                                    value={newProduct.cantidad}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {/* Image fields */}
                            {['imagen1', 'imagen2', 'imagen3', 'imagen4', 'imagen5'].map((imageKey) => (
                                <Form.Group key={imageKey} controlId={`form${imageKey}`}>
                                    <Form.Label>Imagen {imageKey.split('imagen')[1]}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={imageKey}
                                        value={newProduct.imagenes[imageKey]}
                                        onChange={handleImageChange}
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={addOrEditProduct}>
                            {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ProductCrud;
