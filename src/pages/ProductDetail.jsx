import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../components/CartContext.jsx';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const [activeSection, setActiveSection] = useState('descripcion');
  const [zoomed, setZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const toggleZoom = () => {
    setZoomed(!zoomed);
    if (!zoomed) {
      setPosition({ x: 0, y: 0 }); // Reset position when zooming out
    }
  };

  const handleMouseDown = (e) => {
    if (!zoomed) return;

    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProducto(response.data);
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
        setProductosSimilares(response.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
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
    setCantidad(Math.max(newQuantity, 1)); // No permitir cantidad menor a 1
  };

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Handle case where `medidas` might be undefined
  

  return (
    <>
      <NavBar />
      <div className='product-detail'>
        <div className="product-detail-container">
          <div className="productinfo">
            <div
              className={`product-image ${zoomed ? 'zoom' : ''} ${isDragging ? 'active' : ''}`}
              onClick={toggleZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp} /* Para terminar arrastre al salir del área */
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              {producto.imagenes?.imagen1 && (
                <img
                  ref={imgRef}
                  src={producto.imagenes.imagen1}
                  alt={producto.name}
                  style={{
                    transform: zoomed
                      ? `scale(2) translate(${position.x}px, ${position.y}px)`
                      : 'scale(1)',
                    transition: isDragging ? 'none' : 'transform 0.3s ease', // Sin transición mientras se arrastra
                  }}
                />
              )}
            </div>
            <div className="product-info">
              <h1>{producto.name}</h1>
              <hr />
              <p>{producto.descripcion}</p>
              <hr />
              <p>Precio: ${producto.precio.toFixed(2)}</p>
              <p>Categoría: {producto.categoria}</p>
              <div className="quantity-controls">
                <button onClick={handleAddToCart}>Agregar al carrito</button>
                <button
                  onClick={() => setCantidad(prevCantidad => Math.max(prevCantidad - 1, 1))}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <input
                  className='infops'
                  type="number"
                  value={cantidad}
                  onChange={handleQuantityChange}
                  min="1"
                />
                <button onClick={() => setCantidad(prevCantidad => prevCantidad + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="F-tecnica">
          <div className="menu">
            <button className="min-var" onClick={() => showSection('descripcion')}>Descripción</button>
            <button className="min-var" onClick={() => showSection('garantia')}>Garantía</button>
            <button className="min-var" onClick={() => showSection('tips')}>TIPS de Cuidado</button>
          </div>

          <div className="ficha">
            <div className={`section ${activeSection === 'descripcion' ? 'active' : ''}`}>
              <h1>{producto.name}</h1>
              <hr />
              <table>
                <thead>
                  <tr><th>Campo</th><th>Valor</th></tr>
                </thead>
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
              <hr />
              <h3>MegaMuebles</h3>
              <p>Queremos que te sientas como en casa... (información adicional).</p>
            </div>
            <div className={`section ${activeSection === 'garantia' ? 'active' : ''}`}>
              <h2>Garantía</h2>
              <p>La Garantia Estandar de Nuestros Productos es de dos Años</p>
            </div>

            <div className={`section ${activeSection === 'tips' ? 'active' : ''}`}>
              <h2>TIPS de Cuidado</h2>
              <p>Consejos para el cuidado del producto.</p>
            </div>
          </div>
        </div>

        <hr />
        <div className="similar-products">
          <h2>Más Productos Similares</h2>
          <div className="resultados-container">
            <div className="resultados-grid">
              {productosSimilares.map((prod) => (
                <div key={prod.id} className="resultado-card">
                  <img src={prod.imagenes?.imagen1} alt={prod.name} />
                  <div className="resultado-info">
                    <h3>{prod.name}</h3>
                    <p>${prod.precio.toFixed(2)}</p>
                    <Link to={`/productDetail/${prod.id}`}>Ver más</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
