import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../components/CartContext.jsx';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const [activeSection, setActiveSection] = useState('descripcion');
  const [selectedImage, setSelectedImage] = useState('');

  // Datos del modelo de Sketchfab
  const sketchfabModel = {
    title: "Modelo Sketchfab",
    // Usa el ID del modelo 3D directamente
    iframeSrc: `https://sketchfab.com/models/${producto?.imagenes?.model3D}/embed`
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProducto(response.data);
        setSelectedImage(response.data.imagenes?.imagen1 || '');
        fetchProductosSimilares(response.data.categoria);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProductosSimilares = async (categoria) => {
      try {
        const response = await axios.get(`http://localhost:3001/products?categoria=${categoria}`);
        setProductosSimilares(response.data.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!producto) return <p>No product found.</p>;

  const handleAddToCart = () => {
    const productWithQuantity = { ...producto, quantity: cantidad };
    addToCart(productWithQuantity);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setCantidad(Math.max(newQuantity, 1));
  };

  const showSection = (sectionId) => setActiveSection(sectionId);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="product-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={producto.name}
                  className="img-fluid"
                />
              ) : (
                <iframe
                  title={sketchfabModel.title}
                  width="100%"
                  height="480"
                  src={sketchfabModel.iframeSrc}
                  frameBorder="0"
                  allow="autoplay; fullscreen; vr"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <div className="mt-2 d-flex">
              {Object.values(producto.imagenes || {})
                .filter((img, index) => index < 4) // Asegúrate de mostrar solo hasta 4 imágenes
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="img-thumbnail me-2"
                    style={{ width: '100px', cursor: 'pointer' }}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              <div
                className="img-thumbnail me-2"
                style={{ width: '100px', cursor: 'pointer' }}
                onClick={() => setSelectedImage('')} // Cambia a iframe
              >
                <h6>___3D___</h6>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h1>{producto.name}</h1>
            <p>{producto.descripcion}</p>
            <p><strong>Precio:</strong> ${producto.precio.toFixed(2)}</p>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <div className="d-flex align-items-center mb-3">
              <button className="btn btn-primary me-2" onClick={handleAddToCart}>Agregar al carrito</button>
              <div className="input-group" style={{ width: '120px' }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCantidad(Math.max(cantidad - 1, 1))}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={cantidad}
                  onChange={handleQuantityChange}
                  min="1"
                />
                <button className="btn btn-outline-secondary" onClick={() => setCantidad(cantidad + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <div className="btn-group" role="group">
            <button className="btn btn-outline-dark" onClick={() => showSection('descripcion')}>Descripción</button>
            <button className="btn btn-outline-dark" onClick={() => showSection('garantia')}>Garantía</button>
            <button className="btn btn-outline-dark" onClick={() => showSection('tips')}>TIPS de Cuidado</button>
          </div>

          <div className="mt-3">
            {activeSection === 'descripcion' && (
              <div>
                <h3>{producto.name}</h3>
                <table className="table">
                  <thead><tr><th>Campo</th><th>Valor</th></tr></thead>
                  <tbody>
                    <tr><td>Estilo</td><td>{producto.estilo}</td></tr>
                    <tr><td>Peso Neto</td><td>{producto.pesoNeto}</td></tr>
                    <tr><td>Material</td><td>{producto.material}</td></tr>
                    <tr><td>Color</td><td>{producto.color}</td></tr>
                    <tr><td>Requiere Armado</td><td>{producto.requiereArmado}</td></tr>
                    <tr><td>Alto</td><td>{producto.alto}</td></tr>
                    <tr><td>Ancho</td><td>{producto.ancho}</td></tr>
                    <tr><td>Profundidad</td><td>{producto.profundidad}</td></tr>
                    <tr><td>Material del tapiz</td><td>{producto.tapizMaterial}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeSection === 'garantia' && (
              <div><h2>Garantía</h2><p>La Garantía Estándar de Nuestros Productos es de dos Años.</p></div>
            )}
            {activeSection === 'tips' && (
              <div><h2>TIPS de Cuidado</h2><p>Consejos para el cuidado del producto.</p></div>
            )}
          </div>
        </div>

        <div className="my-2">
  <h2>Más Productos Similares</h2>
  <div className="row g-2"> {/* Cambié g-4 a g-2 para reducir el espaciado entre las columnas */}
    {productosSimilares.map((prod) => (
      <div key={prod.id} className="col-md-10 mb-7"> {/* Cambié a col-md-4 y mb-2 para reducir el margen inferior */}
        <div className="card h-300 border-0 shadow-sm text-center">
          <img
            src={prod.imagenes?.imagen1}
            className="card-img-top"
            alt={prod.name}
            style={{ objectFit: 'cover', height: '200px' }} // Mantengo la altura de la imagen
          />
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{prod.name}</h5>
            <p className="card-text">${prod.precio.toFixed(2)}</p>
            <Link to={`/productDetail/${prod.id}`} className="btn btn-outline-primary">Ver más</Link>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
