import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import '../css/ProductCrud.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 

const ProductCrud = () => {
    const [name, setName] = useState("");
    const [material, setMaterial] = useState(0)
    const [estilo, setEstilo] = useState("");
    const [tela, setTela] = useState("");
    const [acabado, setAcabado] = useState("");
    const [color, setColor] = useState("");
    const [tapizMaterial, setTapizMaterial] = useState("");
    const [materialInterno, setMaterialInterno] = useState("");
    const [precio, setPrecio] = useState(0);
    const [descripcion, setDescripcion] = useState("");
    const [requiereArmado, setRequiereArmado] = useState("");
    const [alto, setAlto] = useState(0);
    const [ancho, setAncho] = useState(0);
    const [profundidad, setProfundidad] = useState(0);
    const [pesoNeto, setPesoNeto] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [autor, setAutor] = useState("");
    const [userId, setUserId] = useState("");
    const [imagen1, setimagen1] = useState("");
    const [imagen2, setimagen2] = useState("");
    const [imagen3, setimagen3] = useState("");
    const [imagen4, setimagen4] = useState("");
    const [imagen3D, setImagen3D] = useState("");
    const [productsList, setProducts] = useState ([]);


    const add =()=> {
        Axios.post("http://localhost:3001/productos",{
        
        name:name ,
        material:material,
        estilo:estilo,
        tela:tela,
        acabado:acabado,
        color:color,
        tapizMaterial:tapizMaterial,
        materialInterno:materialInterno,
        precio:precio,
        descripcion:descripcion,
        requiereArmado:requiereArmado,
        alto:alto,
        ancho:ancho,
        profundidad:profundidad,
        pesoNeto:pesoNeto,
        cantidad:cantidad,
        autor:autor,
        imagen1:imagen1,
        imagen2:imagen2,
        imagen3:imagen3,
        imagen4:imagen4,
        imagen3D:imagen3D
    }).then(()=>{
        alert("producto registrado")
    })
    }


    const getProducts = () => {
        Axios.get("http://localhost:3001/llamarProductos").then((response) => {
            setProducts(response.data);
        });
    };

    useEffect(() => {
        getProducts(); // Llama la lista de productos cuando el componente carga
    }, []);

    // Define the options for various fields
    const estiloOptions = ["", "Contemporáneo", "Rústico", "Moderno"];
    const telaOptions = ["", "Cuero", "Telabonita", "Lino"];
    const acabadoOptions = ["", "Cuero", "Aceite", "Liso", "Transparente", "Mate", "Brillante"];
    const colorOptions = ["", "Negro", "Madera", "Blanco", "Azul Marino", "Marrón", "Gris"];
    const tapizMaterialOptions = ["", "Cuero", "Tela"];
    const materialInternoOptions = ["", "Triplex", "Contrachapado", "Espuma", "Metal"];
    const materialOptions = ["", "Triplex", "Contrachapado", "tela", "lona"];
    const armadoOptions = ["No aplica", "Si", "No"];



    return (
        <div className='productos'>
            <div className='datos'>
                <label>name <input 
                onChange={(event)=>{
                    setName(event.target.value)
                }}
                type='text'/></label>
                <label>material<input 
                onChange={(event)=>{
                    setMaterial(event.target.value)
                }}
                type='text'/></label>
                <label>estilo<input 
                onChange={(event)=>{
                    setEstilo(event.target.value)
                }}
                type='text'/></label>
                <label>tela<input 
                onChange={(event)=>{
                    setTela(event.target.value)
                }}
                type='text'/></label>
                <label>acabado<input
                onChange={(event)=>{
                    setAcabado(event.target.value)
                }}
                type='text'/></label>
                <label>color<input 
                onChange={(event)=>{
                    setColor(event.target.value)
                }}
                type='text'/></label>
                <label>tapizMaterial<input 
                onChange={(event)=>{
                    setTapizMaterial(event.target.value)
                }}
                type='text'/></label>
                <label>materialInterno<input 
                onChange={(event)=>{
                    setMaterialInterno(event.target.value)
                }}
                type='text'/></label>
                <label>precio<input 
                onChange={(event)=>{
                    setPrecio(event.target.value)
                }}
                type='number'/></label>
                <label>descripcion<input 
                onChange={(event)=>{
                    setDescripcion(event.target.value)
                }}
                type='text'/></label>
                <label>requiereArmado<input 
                onChange={(event)=>{
                    setRequiereArmado(event.target.value)
                }}
                type='text'/></label>
                <label>alto<input 
                onChange={(event)=>{
                    setAlto(event.target.value)
                }}
                type='number'/></label>
                <label>ancho<input 
                onChange={(event)=>{
                    setAncho(event.target.value)
                }}
                type='number'/></label>
                <label>profundidad<input 
                onChange={(event)=>{
                    setProfundidad(event.target.value)
                }}
                type='number'/></label>
                <label>pesoNeto<input 
                onChange={(event)=>{
                    setPesoNeto(event.target.value)
                }}
                type='number'/></label>
                <label>autor<input 
                onChange={(event)=>{
                    setAutor(event.target.value)
                }}
                type='text'/></label>
                <label>cantidad<input 
                onChange={(event)=>{
                    setCantidad(event.target.value)
                }}
                type='number'/></label>
                <label>imagen1<input 
                onChange={(event)=>{
                    setimagen1(event.target.value)
                }}
                type='text'/></label>
                <label>imagen2<input 
                onChange={(event)=>{
                    setimagen2(event.target.value)
                }}
                type='text'/></label>
                <label>imagen3<input 
                onChange={(event)=>{
                    setimagen3(event.target.value)
                }}
                type='text'/></label>
                <label>imagen4<input 
                onChange={(event)=>{
                    setimagen4(event.target.value)
                }}
                type='text'/></label>
                <label>model3D<input 
                onChange={(event)=>{
                    setImagen3D(event.target.value)
                }}
                type='text'/></label>
                <button onClick={add}>Registar</button>
            </div>
            <div className="productos">
            {/* Tabla CRUD */}
            <div className="tabla-crud">
                <h2>Lista de Productos</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsList.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.imagen1}
                                        alt="Imagen del producto"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                </td>
                                <td>{product.descripcion}</td>
                                <td>{product.cantidad}</td>
                                <td>${product.precio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default ProductCrud;